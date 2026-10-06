import type { Order, FulfillmentStatus, PaymentStatus } from '@/lib/types';

export const FULFILLMENT_FLOW: FulfillmentStatus[] = ['Processing', 'Tailoring', 'Quality Check', 'Dispatched', 'Delivered'];
export const LOW_STOCK_THRESHOLD = 3;

/** Admin figures are shown in INR. */
export function inr(amount: number, compact = false) {
  if (compact && amount >= 100000) return `₹${(amount / 100000).toFixed(amount >= 1000000 ? 1 : 2)}L`;
  if (compact && amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatDateTime(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function orderTime(o: Order) {
  // Orders created before `createdAt` existed only carry a display date
  return new Date(o.createdAt || o.date).getTime();
}

/** An order counts as a sale once it is paid, or confirmed as COD, and has not been cancelled or refunded. */
export function isSale(o: Order) {
  if (o.fulfillmentStatus === 'Cancelled' || o.paymentStatus === 'Refunded' || o.paymentStatus === 'Failed') return false;
  return o.paymentStatus === 'Paid' || o.paymentMethod === 'COD';
}

export function itemCount(o: Order) {
  return o.items.reduce((s, i) => s + i.quantity, 0);
}

export type Tone = 'good' | 'warning' | 'critical' | 'neutral' | 'info';

export function paymentTone(status: PaymentStatus): Tone {
  return status === 'Paid' ? 'good' : status === 'Pending' ? 'warning' : status === 'Failed' ? 'critical' : 'neutral';
}

export function fulfillmentTone(status: FulfillmentStatus): Tone {
  if (status === 'Delivered') return 'good';
  if (status === 'Cancelled') return 'critical';
  if (status === 'Dispatched') return 'info';
  return 'warning';
}

export function paymentLabel(o: Order) {
  if (o.paymentMethod === 'COD' && o.paymentStatus === 'Pending') return 'COD · Due';
  return o.paymentStatus;
}

export function filterByDays(orders: Order[], days: number, offsetDays = 0) {
  const end = Date.now() - offsetDays * 86400000;
  const start = end - days * 86400000;
  return orders.filter((o) => {
    const t = orderTime(o);
    return t > start && t <= end;
  });
}

export interface DayPoint {
  key: string;
  label: string;
  revenue: number;
  orders: number;
}

export function salesByDay(orders: Order[], days: number): DayPoint[] {
  const buckets = new Map<string, DayPoint>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, { key, label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), revenue: 0, orders: 0 });
  }
  for (const o of orders) {
    if (!isSale(o)) continue;
    const d = new Date(orderTime(o));
    d.setHours(0, 0, 0, 0);
    const b = buckets.get(d.toISOString().slice(0, 10));
    if (b) {
      b.revenue += o.total;
      b.orders += 1;
    }
  }
  return [...buckets.values()];
}

export function groupSum<T>(rows: T[], key: (r: T) => string, value: (r: T) => number) {
  const map = new Map<string, number>();
  for (const r of rows) map.set(key(r), (map.get(key(r)) || 0) + value(r));
  return [...map.entries()].map(([label, v]) => ({ label, value: v })).sort((a, b) => b.value - a.value);
}

export function pctChange(current: number, previous: number) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Customers who bought in the last `days` and had also bought before that window. */
export function returningCustomers(orders: Order[], days: number) {
  const start = Date.now() - days * 86400000;
  const before = new Set(orders.filter((o) => isSale(o) && orderTime(o) <= start).map((o) => o.customerEmail.toLowerCase()));
  const during = new Set(orders.filter((o) => isSale(o) && orderTime(o) > start).map((o) => o.customerEmail.toLowerCase()));
  return [...during].filter((c) => before.has(c)).length;
}
