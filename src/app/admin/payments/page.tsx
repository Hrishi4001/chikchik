'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Badge, BarList, PageHeader, Segmented, StatTile } from '@/components/admin/ui';
import { downloadCsv, filterByDays, formatDateTime, groupSum, inr, type Tone } from '@/lib/admin';
import type { Order } from '@/lib/types';
import styles from '../admin.module.css';

type TxStatus = 'Captured' | 'Failed' | 'Created' | 'Refunded' | 'COD due' | 'COD collected';
type Range = 7 | 30 | 90 | 0;

interface Tx {
  key: string;
  at: string;
  order: Order;
  status: TxStatus;
  method: string;
  reference?: string;
  amount: number;
  reason?: string;
}

const TONE: Record<TxStatus, Tone> = {
  Captured: 'good',
  'COD collected': 'good',
  Failed: 'critical',
  Created: 'neutral',
  Refunded: 'neutral',
  'COD due': 'warning'
};

export default function AdminPaymentsPage() {
  const { orders } = useStore();
  const [range, setRange] = useState<Range>(30);
  const [filter, setFilter] = useState<'all' | TxStatus>('all');
  const [gateway, setGateway] = useState<{ mode: 'cashfree' | 'razorpay' | 'mock'; cashfreeEnv?: string | null } | null>(null);

  useEffect(() => {
    fetch('/api/payments/config')
      .then((r) => r.json())
      .then(setGateway)
      .catch(() => setGateway(null));
  }, []);

  const scoped = range ? filterByDays(orders, range) : orders;

  const transactions = useMemo(() => {
    const rows: Tx[] = [];
    for (const o of scoped) {
      if (o.paymentMethod === 'COD') {
        if (o.fulfillmentStatus === 'Cancelled' && o.paymentStatus !== 'Paid' && o.paymentStatus !== 'Refunded') continue;
        const collected = o.paymentStatus === 'Paid' || o.paymentStatus === 'Refunded';
        rows.push({ key: `${o.id}-cod`, at: o.payment?.paidAt || o.createdAt, order: o, status: collected ? 'COD collected' : 'COD due', method: 'COD', amount: o.total });
      }
      for (const a of o.payment?.attempts || []) {
        rows.push({
          key: a.id,
          at: a.at,
          order: o,
          status: a.status,
          method: a.method || o.paymentMethod,
          reference: a.gatewayPaymentId || a.gatewayOrderId,
          amount: o.total,
          reason: a.reason
        });
      }
      if (o.payment?.refundedAt) {
        rows.push({ key: `${o.id}-refund`, at: o.payment.refundedAt, order: o, status: 'Refunded', method: o.paymentMethod, reference: o.payment.gatewayPaymentId, amount: o.payment.refundAmount || o.total });
      }
    }
    return rows.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  }, [scoped]);

  const sum = (s: TxStatus) => transactions.filter((t) => t.status === s).reduce((acc, t) => acc + t.amount, 0);
  const count = (s: TxStatus) => transactions.filter((t) => t.status === s).length;
  const collected = sum('Captured') + sum('COD collected');
  const onlineFinished = count('Captured') + count('Failed');
  const successRate = onlineFinished ? (count('Captured') / onlineFinished) * 100 : null;
  const byMethod = groupSum(
    transactions.filter((t) => t.status === 'Captured' || t.status === 'COD collected'),
    (t) => t.method,
    (t) => t.amount
  );
  const failureReasons = groupSum(
    transactions.filter((t) => t.status === 'Failed'),
    (t) => t.reason || 'Unknown',
    () => 1
  );

  const visible = filter === 'all' ? transactions : transactions.filter((t) => t.status === filter);

  const exportCsv = () =>
    downloadCsv(`payments-${new Date().toISOString().slice(0, 10)}.csv`, [
      ['Date', 'Order', 'Customer', 'Status', 'Method', 'Reference', 'Amount', 'Reason'],
      ...visible.map((t) => [t.at, t.order.orderNumber, t.order.customerName, t.status, t.method, t.reference || '', t.amount, t.reason || ''])
    ]);

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle={
          gateway
            ? gateway.mode === 'cashfree'
              ? `Cashfree connected (${gateway.cashfreeEnv})`
              : gateway.mode === 'razorpay'
                ? 'Razorpay connected (live keys)'
                : 'No gateway configured — checkout runs in test mode'
            : 'Checking gateway…'
        }
        actions={
          <>
            <Segmented
              label="Date range"
              value={range}
              onChange={setRange}
              options={[
                { value: 7, label: '7d' },
                { value: 30, label: '30d' },
                { value: 90, label: '90d' },
                { value: 0, label: 'All' }
              ]}
            />
            <button className={styles.btn} onClick={exportCsv} disabled={!visible.length}>
              <Download size={15} /> Export CSV
            </button>
          </>
        }
      />

      <div className={styles.kpis}>
        <StatTile label="Collected" value={inr(collected)} hint={`${count('Captured') + count('COD collected')} payments`} />
        <StatTile label="COD outstanding" value={inr(sum('COD due'))} hint={`${count('COD due')} orders awaiting cash`} />
        <StatTile label="Online success rate" value={successRate == null ? '—' : `${successRate.toFixed(1)}%`} hint={`${count('Failed')} failed attempts`} />
        <StatTile label="Refunded" value={inr(sum('Refunded'))} hint={`${count('Refunded')} refunds`} />
      </div>

      <div className={styles.halves}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Collected by method</h2>
          </div>
          <BarList rows={byMethod} formatValue={(v) => inr(v, true)} secondary={(r) => `${collected ? Math.round((r.value / collected) * 100) : 0}%`} />
        </section>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Failure reasons</h2>
          </div>
          <BarList rows={failureReasons} formatValue={(v) => `${v}`} empty="No failed payments in this period" />
        </section>
      </div>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Transactions</h2>
          <select className={styles.select} value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} aria-label="Transaction status">
            <option value="all">All statuses</option>
            {(Object.keys(TONE) as TxStatus[]).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        {visible.length === 0 ? (
          <div className={styles.empty}>No transactions in this period</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Method</th>
                  <th>Reference</th>
                  <th className={styles.num}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {visible.slice(0, 200).map((t) => (
                  <tr key={t.key}>
                    <td className={styles.muted}>{formatDateTime(t.at)}</td>
                    <td>
                      <Link href={`/admin/orders/${t.order.id}`}>
                        <strong>{t.order.orderNumber}</strong>
                      </Link>
                      <div className={styles.muted}>{t.order.customerName}</div>
                    </td>
                    <td>
                      <Badge tone={TONE[t.status]}>{t.status}</Badge>
                      {t.reason && <div className={styles.muted}>{t.reason}</div>}
                    </td>
                    <td>{t.method}</td>
                    <td className={styles.mono}>{t.reference || '—'}</td>
                    <td className={styles.num}>{t.status === 'Refunded' ? `− ${inr(t.amount)}` : inr(t.amount)}</td>
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
