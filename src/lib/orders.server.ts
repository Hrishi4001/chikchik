import { randomBytes } from 'node:crypto';
import { INITIAL_PRODUCTS, PINCODE_DATABASE } from './data';
import { COD_LIMIT, PROMO_CODES, computeTotals } from './cartRewards';
import { kvGet, kvList, kvSet } from './kv.server';
import { createGatewayOrder, getGatewayMode } from './payments/razorpay.server';
import type { Order, OrderEvent, PaymentAttempt, PaymentMethod, PlaceOrderInput } from './types';

export type { PlaceOrderInput };

const STORE = 'orders';

export class OrderError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
  }
}

export interface GatewayStart {
  mode: 'razorpay' | 'mock';
  keyId: string | null;
  gatewayOrderId: string;
  amount: number; // paise
}

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
export const normalisePhone = (phone: string) => phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');

export function pincodeInfo(pincode: string) {
  if (PINCODE_DATABASE[pincode]) return { ...PINCODE_DATABASE[pincode], serviceable: true };
  // Unlisted PINs ship via the national courier network
  return /^[1-9]\d{5}$/.test(pincode) ? { city: '', state: '', days: 4, cod: true, serviceable: true } : null;
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
export async function placeOrder(raw: PlaceOrderInput): Promise<{ order: Order; gateway?: GatewayStart }> {
  const name = str(raw?.customer?.name, 80);
  const email = str(raw?.customer?.email, 120);
  const phone = normalisePhone(str(raw?.customer?.phone, 20));
  const street = str(raw?.address?.street, 200);
  const city = str(raw?.address?.city, 80);
  const state = str(raw?.address?.state, 80);
  const pincode = str(raw?.address?.pincode, 6);
  const shippingMethod = raw?.shippingMethod === 'express' ? 'express' : 'standard';
  const paymentMethod = raw?.paymentMethod === 'COD' ? 'COD' : 'online';
  const promoCode = str(raw?.promoCode, 30).toUpperCase() || undefined;

  if (name.length < 2) throw new OrderError('Enter your full name');
  if (phone.length !== 10) throw new OrderError('Enter a 10-digit mobile number');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new OrderError('Enter a valid email address');
  if (street.length < 5 || !city || !state) throw new OrderError('Enter your full delivery address');
  const pin = pincodeInfo(pincode);
  if (!pin) throw new OrderError('Enter a valid 6-digit pincode');

  if (!Array.isArray(raw?.items) || raw.items.length === 0 || raw.items.length > 30) throw new OrderError('Your bag is empty');
  const items = raw.items.map((line) => {
    const product = INITIAL_PRODUCTS.find((p) => p.id === line?.productId);
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
  if (paymentMethod === 'COD' && (!pin.cod || totals.total > COD_LIMIT)) throw new OrderError('Cash on Delivery is not available for this order');

  const now = new Date();
  const order: Order = {
    id: `ord-${now.getTime().toString(36)}${randomBytes(3).toString('hex')}`,
    orderNumber: `HEVA-${now.getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`,
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
    paymentMethod: paymentMethod === 'COD' ? 'COD' : 'UPI',
    paymentStatus: 'Pending',
    payment: { provider: paymentMethod === 'COD' ? 'cod' : getGatewayMode(), attempts: [] },
    fulfillmentStatus: 'Processing',
    estimatedDelivery: addDays(pin.days + (shippingMethod === 'express' ? 0 : 2)),
    history: [
      { at: now.toISOString(), label: 'Order created' },
      ...(paymentMethod === 'COD' ? [{ at: now.toISOString(), label: 'Cash on Delivery order confirmed', note: 'Payment to be collected at delivery' }] : [])
    ]
  };

  if (paymentMethod === 'COD') {
    await saveOrder(order);
    return { order };
  }
  return startPayment(order);
}

/** Opens a gateway order for the stored total; reused for payment retries. */
export async function startPayment(order: Order): Promise<{ order: Order; gateway: GatewayStart }> {
  if (order.paymentStatus === 'Paid') throw new OrderError('This order is already paid', 409);
  const gw = await createGatewayOrder(Math.round(order.total * 100), order.orderNumber, { order_id: order.id });
  const mode = getGatewayMode();
  const attempt: PaymentAttempt = { id: `att-${Date.now()}`, at: new Date().toISOString(), status: 'Created', gatewayOrderId: gw.id };
  const updated: Order = {
    ...order,
    payment: { ...(order.payment || { provider: mode }), provider: mode, gatewayOrderId: gw.id, attempts: [...(order.payment?.attempts || []), attempt] }
  };
  await saveOrder(updated);
  return {
    order: updated,
    gateway: { mode, keyId: mode === 'razorpay' ? process.env.RAZORPAY_KEY_ID ?? null : null, gatewayOrderId: gw.id, amount: gw.amount }
  };
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
