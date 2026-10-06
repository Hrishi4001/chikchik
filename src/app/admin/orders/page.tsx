'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Download } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Badge, PageHeader } from '@/components/admin/ui';
import { downloadCsv, fulfillmentTone, inr, itemCount, orderTime, paymentLabel, paymentTone } from '@/lib/admin';
import type { FulfillmentStatus, PaymentStatus } from '@/lib/types';
import styles from '../admin.module.css';

const FULFILLMENT: (FulfillmentStatus | 'All')[] = ['All', 'Processing', 'Tailoring', 'Quality Check', 'Dispatched', 'Delivered', 'Cancelled'];
const PAYMENT: (PaymentStatus | 'All')[] = ['All', 'Paid', 'Pending', 'Failed', 'Refunded'];

export default function AdminOrdersPage() {
  const router = useRouter();
  const { orders } = useStore();
  const [query, setQuery] = useState('');
  const [fulfillment, setFulfillment] = useState<(typeof FULFILLMENT)[number]>('All');
  const [payment, setPayment] = useState<(typeof PAYMENT)[number]>('All');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'total'>('newest');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter((o) => fulfillment === 'All' || o.fulfillmentStatus === fulfillment)
      .filter((o) => payment === 'All' || o.paymentStatus === payment)
      .filter(
        (o) =>
          !q ||
          [o.orderNumber, o.customerName, o.customerEmail, o.customerPhone, o.shippingAddress.city, o.payment?.gatewayPaymentId]
            .filter(Boolean)
            .some((v) => v!.toLowerCase().includes(q))
      )
      .sort((a, b) => (sort === 'total' ? b.total - a.total : sort === 'oldest' ? orderTime(a) - orderTime(b) : orderTime(b) - orderTime(a)));
  }, [orders, query, fulfillment, payment, sort]);

  const exportCsv = () =>
    downloadCsv(`orders-${new Date().toISOString().slice(0, 10)}.csv`, [
      ['Order', 'Date', 'Customer', 'Email', 'Phone', 'City', 'Items', 'Subtotal', 'Discount', 'Shipping', 'Total', 'Method', 'Payment', 'Payment ID', 'Fulfilment', 'Tracking'],
      ...filtered.map((o) => [
        o.orderNumber,
        o.createdAt || o.date,
        o.customerName,
        o.customerEmail,
        o.customerPhone,
        o.shippingAddress.city,
        itemCount(o),
        o.subtotal,
        o.discount,
        o.shippingFee,
        o.total,
        o.paymentMethod,
        o.paymentStatus,
        o.payment?.gatewayPaymentId || '',
        o.fulfillmentStatus,
        o.trackingNumber || ''
      ])
    ]);

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle={`${filtered.length} of ${orders.length} orders`}
        actions={
          <button className={styles.btn} onClick={exportCsv} disabled={!filtered.length}>
            <Download size={15} /> Export CSV
          </button>
        }
      />

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <Search size={15} color="#8e8880" />
          <input placeholder="Search order #, customer, email, phone, city" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search orders" />
        </label>
        <select className={styles.select} value={fulfillment} onChange={(e) => setFulfillment(e.target.value as typeof fulfillment)} aria-label="Fulfilment status">
          {FULFILLMENT.map((s) => (
            <option key={s} value={s}>
              {s === 'All' ? 'All fulfilment' : s}
            </option>
          ))}
        </select>
        <select className={styles.select} value={payment} onChange={(e) => setPayment(e.target.value as typeof payment)} aria-label="Payment status">
          {PAYMENT.map((s) => (
            <option key={s} value={s}>
              {s === 'All' ? 'All payments' : s}
            </option>
          ))}
        </select>
        <select className={styles.select} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="total">Highest total</option>
        </select>
      </div>

      <section className={styles.card}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>{orders.length ? 'No orders match these filters' : 'No orders yet'}</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Method</th>
                  <th>Payment</th>
                  <th>Fulfilment</th>
                  <th className={styles.num}>Total</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className={styles.rowLink} onClick={() => router.push(`/admin/orders/${o.id}`)}>
                    <td>
                      <Link href={`/admin/orders/${o.id}`} onClick={(e) => e.stopPropagation()}>
                        <strong>{o.orderNumber}</strong>
                      </Link>
                      <div className={styles.muted}>{o.date}</div>
                    </td>
                    <td>
                      {o.customerName}
                      <div className={styles.muted}>{o.shippingAddress.city}</div>
                    </td>
                    <td>{itemCount(o)}</td>
                    <td>{o.paymentMethod}</td>
                    <td>
                      <Badge tone={paymentTone(o.paymentStatus)}>{paymentLabel(o)}</Badge>
                    </td>
                    <td>
                      <Badge tone={fulfillmentTone(o.fulfillmentStatus)}>{o.fulfillmentStatus}</Badge>
                    </td>
                    <td className={styles.num}>{inr(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
