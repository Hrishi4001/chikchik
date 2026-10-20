import { Order, PaymentMethod, Product, FulfillmentStatus } from '@/lib/types';
import { PINCODE_DATABASE } from '@/lib/data';

// Demo data for the admin console. Every generated order is flagged `isSample` so it can be removed in one click.

const FIRST_NAMES = ['Aarohi', 'Meera', 'Ishita', 'Kavya', 'Nandini', 'Riya', 'Saanvi', 'Tara', 'Diya', 'Anika', 'Pooja', 'Lakshmi'];
const LAST_NAMES = ['Sharma', 'Iyer', 'Reddy', 'Kapoor', 'Nair', 'Banerjee', 'Desai', 'Menon', 'Gupta', 'Rao'];
const METHODS: PaymentMethod[] = ['UPI', 'UPI', 'UPI', 'Card', 'Card', 'NetBanking', 'Wallet', 'COD'];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSampleOrders(products: Product[], days = 90): Order[] {
  if (products.length === 0) return [];
  const rand = mulberry32(42);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const pins = Object.entries(PINCODE_DATABASE);
  const orders: Order[] = [];
  const now = Date.now();

  for (let d = days - 1; d >= 0; d--) {
    const perDay = Math.floor(rand() * 4) + (d < 30 ? 1 : 0);
    for (let n = 0; n < perDay; n++) {
      const created = new Date(now - d * 86400000 - Math.floor(rand() * 86400000 * 0.9));
      const lineCount = rand() < 0.75 ? 1 : 2;
      const items = Array.from({ length: lineCount }, () => {
        const p = pick(products);
        return {
          productId: p.id,
          productTitle: p.title,
          productImage: p.images[0],
          category: p.categoryLabel,
          size: pick(p.sizes),
          quantity: rand() < 0.85 ? 1 : 2,
          price: p.price
        };
      });
      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const discount = rand() < 0.2 ? Math.round(subtotal * 0.1) : 0;
      const shippingFee = subtotal >= 15000 ? 0 : 500;
      const total = subtotal - discount + shippingFee;
      const method = pick(METHODS);
      const [pincode, loc] = pick(pins);
      const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;

      const age = d;
      let fulfillmentStatus: FulfillmentStatus =
        age > 10 ? 'Delivered' : age > 6 ? 'Dispatched' : age > 3 ? 'Quality Check' : age > 1 ? 'Packing' : 'Processing';
      const failed = method !== 'COD' && rand() < 0.06;
      const refunded = !failed && fulfillmentStatus === 'Delivered' && rand() < 0.04;
      if (failed || refunded) fulfillmentStatus = 'Cancelled';

      const paymentStatus = failed ? 'Failed' : refunded ? 'Refunded' : method === 'COD' && fulfillmentStatus !== 'Delivered' ? 'Pending' : 'Paid';
      const gatewayOrderId = method === 'COD' ? undefined : `order_sample_${created.getTime().toString(36)}`;
      const gatewayPaymentId = method === 'COD' || failed ? undefined : `pay_sample_${created.getTime().toString(36)}`;
      const iso = created.toISOString();

      orders.push({
        id: `ord-sample-${created.getTime()}-${n}`,
        orderNumber: `RVN-${created.getFullYear()}-${String(1000 + orders.length).padStart(4, '0')}`,
        date: created.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        createdAt: iso,
        customerName: name,
        customerEmail: `${name.toLowerCase().replace(' ', '.')}@example.com`,
        customerPhone: `+91 9${Math.floor(rand() * 1e9).toString().padStart(9, '0')}`,
        shippingAddress: {
          id: `addr-sample-${orders.length}`,
          fullName: name,
          phone: '+91 90000 00000',
          street: `${Math.floor(rand() * 200) + 1}, Sample Residency`,
          city: loc.city,
          state: loc.state,
          pincode,
          country: 'India'
        },
        items,
        subtotal,
        discount,
        promoCode: discount ? 'CHIKCHIK10' : undefined,
        shippingFee,
        shippingMethod: 'standard',
        total,
        currency: 'INR',
        paymentMethod: method,
        paymentStatus,
        payment: {
          provider: method === 'COD' ? 'cod' : 'mock',
          gatewayOrderId,
          gatewayPaymentId,
          paidAt: paymentStatus === 'Paid' || refunded ? iso : undefined,
          refundedAt: refunded ? iso : undefined,
          refundAmount: refunded ? total : undefined,
          attempts:
            method === 'COD'
              ? []
              : [
                  {
                    id: `att-${created.getTime()}`,
                    at: iso,
                    status: failed ? 'Failed' : 'Captured',
                    gatewayOrderId,
                    gatewayPaymentId,
                    method,
                    reason: failed ? 'Payment declined by bank' : undefined
                  }
                ]
        },
        fulfillmentStatus,
        trackingNumber: ['Dispatched', 'Delivered'].includes(fulfillmentStatus) ? `BD${created.getTime().toString().slice(-9)}IN` : undefined,
        courier: ['Dispatched', 'Delivered'].includes(fulfillmentStatus) ? 'Blue Dart' : undefined,
        estimatedDelivery: new Date(created.getTime() + loc.days * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        history: [{ at: iso, label: 'Order created' }],
        isSample: true
      });
    }
  }
  return orders.reverse();
}
