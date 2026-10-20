import { randomBytes } from 'node:crypto';
import { PINCODE_DATABASE } from './data';
import { listProducts } from './products.server';
import { PROMO_CODES, computeTotals } from './cartRewards';
import { kvGet, kvList, kvSet } from './kv.server';
import { createGatewayOrder } from './payments/razorpay.server';
import {
  createCashfreeOrder,
  fetchCashfreeOrderExtended,
  getCashfreeEnv,
  getCashfreeOutcome,
  isOneClickEnabled,
  type CashfreeEnv
} from './payments/cashfree.server';
import { getGatewayMode, type ActiveGateway } from './payments/gateway.server';
import type { OneClickOrderInput, Order, OrderEvent, PaymentAttempt, PaymentMethod, PlaceOrderInput } from './types';

export type { PlaceOrderInput };

const STORE = 'orders';

export class OrderError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
  }
}

export interface GatewayStart {
  mode: ActiveGateway;
  keyId: string | null;
  gatewayOrderId: string;
  amount: number; // paise
  /** Cashfree only: session handed to the browser SDK. */
  paymentSessionId?: string;
  cashfreeEnv?: CashfreeEnv;
}

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
export const normalisePhone = (phone: string) => phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');

export function pincodeInfo(pincode: string) {
  if (PINCODE_DATABASE[pincode]) return { ...PINCODE_DATABASE[pincode], serviceable: true };
  // Unlisted PINs ship via the national courier network
  return /^[1-9]\d{5}$/.test(pincode) ? { city: '', state: '', days: 4, serviceable: true } : null;
}

function addDays(days: number) {
  return new Date(Date.now() + days * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export const getOrder = (id: string) => kvGet<Order>(STORE, id);
export const saveOrder = (order: Order) => kvSet(STORE, order.id, order);

export async function listOrders() {
  return (await kvList<Order>(STORE)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function findOrderByGatewayId(gatewayOrderId: string) {
  return (await listOrders()).find(
    (o) => o.payment?.gatewayOrderId === gatewayOrderId || o.payment?.attempts.some((a) => a.gatewayOrderId === gatewayOrderId)
  );
}

const withEvent = (order: Order, event: Omit<OrderEvent, 'at'>): Order => ({
  ...order,
  history: [...(order.history || []), { ...event, at: new Date().toISOString() }]
});

/** Validates the cart against the server catalog and prices it; the browser's numbers are never trusted. */
async function priceCart(rawItems: PlaceOrderInput['items'], promoCode: string | undefined, shippingMethod: 'standard' | 'express', phone: string) {
  const raw = { items: rawItems };
  if (!Array.isArray(raw?.items) || raw.items.length === 0 || raw.items.length > 30) throw new OrderError('Your bag is empty');
  const catalog = await listProducts();
  const items = raw.items.map((line) => {
    const product = catalog.find((p) => p.id === line?.productId);
    const quantity = Math.floor(Number(line?.quantity));
    if (!product) throw new OrderError('An item in your bag is no longer available');
    if (!product.inStock || product.stockCount <= 0) throw new OrderError(`"${product.title}" has sold out`);
    if (!(quantity >= 1 && quantity <= Math.min(10, product.stockCount))) throw new OrderError(`Choose a valid quantity for "${product.title}"`);
    const size = str(line.size, 20);
    const freeSize = product.sizes.length <= 1;
    if (!freeSize && !product.sizes.includes(size)) throw new OrderError(`Choose a size for "${product.title}"`);
    return {
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0],
      category: product.categoryLabel,
      size: freeSize ? product.sizes[0] || 'Free Size' : size,
      quantity,
      price: product.price
    };
  });

  if (promoCode) {
    const promo = PROMO_CODES[promoCode];
    if (!promo) throw new OrderError(`"${promoCode}" isn't a valid code`);
    if (promo.firstOrderOnly) {
      const previous = (await listOrders()).some(
        (o) => normalisePhone(o.customerPhone) === phone && (o.paymentStatus === 'Paid' || (o.paymentMethod === 'COD' && o.fulfillmentStatus !== 'Cancelled'))
      );
      if (previous) throw new OrderError(`${promoCode} is for first orders only. Remove it to continue.`, 409);
    }
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totals = computeTotals(subtotal, promoCode, shippingMethod);
  return { items, totals };
}

export async function placeOrder(raw: PlaceOrderInput, origin?: string): Promise<{ order: Order; gateway?: GatewayStart }> {
  const name = str(raw?.customer?.name, 80);
  const email = str(raw?.customer?.email, 120);
  const phone = normalisePhone(str(raw?.customer?.phone, 20));
  const street = str(raw?.address?.street, 200);
  const city = str(raw?.address?.city, 80);
  const state = str(raw?.address?.state, 80);
  const pincode = str(raw?.address?.pincode, 6);
  const shippingMethod = raw?.shippingMethod === 'express' ? 'express' : 'standard';
  const promoCode = str(raw?.promoCode, 30).toUpperCase() || undefined;

  if (name.length < 2) throw new OrderError('Enter your full name');
  if (phone.length !== 10) throw new OrderError('Enter a 10-digit mobile number');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new OrderError('Enter a valid email address');
  if (street.length < 5 || !city || !state) throw new OrderError('Enter your full delivery address');
  const pin = pincodeInfo(pincode);
  if (!pin) throw new OrderError('Enter a valid 6-digit pincode');

  const { items, totals } = await priceCart(raw.items, promoCode, shippingMethod, phone);

  const now = new Date();
  const order: Order = {
    id: `ord-${now.getTime().toString(36)}${randomBytes(3).toString('hex')}`,
    orderNumber: `RVN-${now.getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`,
    date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    createdAt: now.toISOString(),
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    shippingAddress: { id: 'addr-1', fullName: name, phone, street, apartment: str(raw.address.apartment, 120), city, state, pincode, country: 'India' },
    items,
    subtotal: totals.subtotal,
    discount: totals.discount,
    promoCode,
    shippingFee: totals.shippingFee,
    shippingMethod,
    total: totals.total,
    currency: 'INR',
    paymentMethod: 'UPI',
    paymentStatus: 'Pending',
    payment: { provider: getGatewayMode(), attempts: [] },
    fulfillmentStatus: 'Processing',
    estimatedDelivery: addDays(pin.days + (shippingMethod === 'express' ? 0 : 2)),
    history: [{ at: now.toISOString(), label: 'Order created' }]
  };

  return startPayment(order, origin);
}

/** Opens a gateway order for the stored total; reused for payment retries. */
export async function startPayment(order: Order, origin?: string): Promise<{ order: Order; gateway: GatewayStart }> {
  if (order.paymentStatus === 'Paid') throw new OrderError('This order is already paid', 409);
  const mode = getGatewayMode();
  const amount = Math.round(order.total * 100);
  let gateway: GatewayStart;

  if (mode === 'cashfree') {
    const catalog = await listProducts();
    // Cashfree order ids must be unique per attempt, so suffix our order number.
    const gatewayOrderId = `${order.orderNumber}_${Date.now().toString(36)}`;
    const cf = await createCashfreeOrder({
      orderId: gatewayOrderId,
      amount: amount / 100,
      customer: { id: normalisePhone(order.customerPhone) || order.id, name: order.customerName, email: order.customerEmail, phone: order.customerPhone },
      returnUrl: origin?.startsWith('https://') ? `${origin}/api/payments/cashfree/return?order_id={order_id}` : undefined,
      notifyUrl: origin?.startsWith('https://') ? `${origin}/api/payments/cashfree/webhook` : undefined,
      note: `Chikchik order ${order.orderNumber}`,
      oneClick: order.oneClick
        ? {
            cartItems: order.items.map((i) => ({
              item_id: `${i.productId}-${i.size}`.slice(0, 50),
              item_name: i.productTitle,
              item_description: i.size,
              item_details_url: origin ? `${origin}/product/${catalog.find((p) => p.id === i.productId)?.slug ?? ''}` : undefined,
              item_image_url: origin && i.productImage?.startsWith('/') ? `${origin}${i.productImage}` : i.productImage,
              item_original_unit_price: i.price,
              item_discounted_unit_price: i.price,
              item_quantity: i.quantity,
              item_currency: 'INR' as const
            }))
          }
        : undefined
    });
    gateway = { mode, keyId: null, gatewayOrderId, amount, paymentSessionId: cf.payment_session_id, cashfreeEnv: getCashfreeEnv() };
  } else {
    const gw = await createGatewayOrder(amount, order.orderNumber, { order_id: order.id });
    gateway = { mode, keyId: mode === 'razorpay' ? process.env.RAZORPAY_KEY_ID ?? null : null, gatewayOrderId: gw.id, amount: gw.amount };
  }

  const attempt: PaymentAttempt = { id: `att-${Date.now()}`, at: new Date().toISOString(), status: 'Created', gatewayOrderId: gateway.gatewayOrderId };
  const updated: Order = {
    ...order,
    payment: { ...(order.payment || { provider: mode }), provider: mode, gatewayOrderId: gateway.gatewayOrderId, attempts: [...(order.payment?.attempts || []), attempt] }
  };
  await saveOrder(updated);
  return { order: updated, gateway };
}

export async function markPaid(order: Order, gatewayOrderId: string, paymentId: string, method: PaymentMethod = 'UPI') {
  if (order.paymentStatus === 'Paid') return order;
  const paidAt = new Date().toISOString();
  const updated = withEvent(
    {
      ...order,
      paymentStatus: 'Paid',
      paymentMethod: method,
      payment: {
        ...order.payment!,
        gatewayOrderId,
        gatewayPaymentId: paymentId,
        paidAt,
        attempts: (order.payment?.attempts || []).map((a) =>
          a.gatewayOrderId === gatewayOrderId ? { ...a, status: 'Captured' as const, gatewayPaymentId: paymentId, method } : a
        )
      }
    },
    { label: 'Payment captured', note: `${method} · ${paymentId}` }
  );
  await saveOrder(updated);
  return updated;
}

export async function markPaymentFailed(order: Order, gatewayOrderId: string, reason: string, paymentId?: string) {
  if (order.paymentStatus === 'Paid') return order;
  const updated = withEvent(
    {
      ...order,
      paymentStatus: 'Failed',
      payment: {
        ...order.payment!,
        attempts: (order.payment?.attempts || []).map((a) =>
          a.gatewayOrderId === gatewayOrderId && a.status === 'Created' ? { ...a, status: 'Failed' as const, reason, gatewayPaymentId: paymentId } : a
        )
      }
    },
    { label: 'Payment failed', note: reason }
  );
  await saveOrder(updated);
  return updated;
}

/**
 * Cashfree One Click Checkout: the shopper only gives a mobile number here; Cashfree handles
 * OTP login, address and payment. Contact and address are filled in once the order is paid.
 */
export async function placeOneClickOrder(raw: OneClickOrderInput, origin?: string): Promise<{ order: Order; gateway: GatewayStart }> {
  if (!isOneClickEnabled()) throw new OrderError('Express checkout is not available right now', 404);
  const phone = normalisePhone(str(raw?.phone, 20));
  if (phone.length !== 10) throw new OrderError('Enter a 10-digit mobile number');
  const promoCode = str(raw?.promoCode, 30).toUpperCase() || undefined;
  const { items, totals } = await priceCart(raw.items, promoCode, 'standard', phone);

  const now = new Date();
  const order: Order = {
    id: `ord-${now.getTime().toString(36)}${randomBytes(3).toString('hex')}`,
    orderNumber: `RVN-${now.getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`,
    date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    createdAt: now.toISOString(),
    customerName: 'Express checkout',
    customerEmail: '',
    customerPhone: phone,
    shippingAddress: { id: 'addr-1', fullName: '', phone, street: '', city: '', state: '', pincode: '', country: 'India' },
    items,
    subtotal: totals.subtotal,
    discount: totals.discount,
    promoCode,
    shippingFee: totals.shippingFee,
    shippingMethod: 'standard',
    total: totals.total,
    currency: 'INR',
    paymentMethod: 'UPI',
    paymentStatus: 'Pending',
    payment: { provider: 'cashfree', attempts: [] },
    fulfillmentStatus: 'Processing',
    estimatedDelivery: addDays(6),
    history: [{ at: now.toISOString(), label: 'Order created', note: 'Cashfree One Click Checkout' }],
    oneClick: true
  };
  return startPayment(order, origin);
}

/** Copies the contact and delivery address captured by One Click Checkout onto the order. */
async function applyOneClickDetails(order: Order, gatewayOrderId: string): Promise<Order> {
  if (!order.oneClick || order.shippingAddress.street) return order;
  try {
    const ext = await fetchCashfreeOrderExtended(gatewayOrderId);
    const ship = ext.shipping_address || ext.billing_address || {};
    const customer = ext.customer_details || {};
    const pincode = str(ship.pin_code, 6);
    const pin = pincodeInfo(pincode);
    const name = str(ship.name || customer.customer_name, 80) || order.customerName;
    const phone = normalisePhone(str(ship.phone || customer.customer_phone, 20)) || order.customerPhone;
    const updated = withEvent(
      {
        ...order,
        customerName: name,
        customerEmail: str(ship.email || customer.customer_email, 120),
        customerPhone: phone,
        shippingAddress: {
          ...order.shippingAddress,
          fullName: name,
          phone,
          street: str(ship.address_line_one, 200),
          apartment: str(ship.address_line_two, 120),
          city: str(ship.city, 80) || pin?.city || '',
          state: str(ship.state, 80) || pin?.state || '',
          pincode
        },
        ...(pin && { estimatedDelivery: addDays(pin.days + 2) })
      },
      { label: 'Address received from Cashfree', note: [str(ship.city, 80), pincode].filter(Boolean).join(' · ') }
    );
    await saveOrder(updated);
    return updated;
  } catch (err) {
    console.error('[orders] cashfree extended lookup failed', order.id, err);
    return order;
  }
}

/** Asks Cashfree what happened to an attempt and records it; the browser's report is never trusted. */
export async function settleCashfreeAttempt(order: Order, gatewayOrderId: string) {
  const outcome = await getCashfreeOutcome(gatewayOrderId);
  if (outcome.status === 'paid') {
    const paid = await markPaid(order, gatewayOrderId, outcome.paymentId, outcome.method);
    return { outcome, order: await applyOneClickDetails(paid, gatewayOrderId) };
  }
  if (outcome.status === 'failed') return { outcome, order: await markPaymentFailed(order, gatewayOrderId, outcome.reason, outcome.paymentId) };
  return { outcome, order };
}
