'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IndianRupee, ShoppingBag, Truck, AlertTriangle, Plus, Database } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Badge, BarList, ColumnChart, PageHeader, StatTile } from '@/components/admin/ui';
import {
  filterByDays,
  fulfillmentTone,
  inr,
  isSale,
  LOW_STOCK_THRESHOLD,
  paymentLabel,
  paymentTone,
  pctChange,
  salesByDay,
  groupSum
} from '@/lib/admin';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const { orders, products, loadSampleOrders, clearSampleOrders } = useStore();

  const current = filterByDays(orders, 30);
  const previous = filterByDays(orders, 30, 30);
  const sales = current.filter(isSale);
  const prevSales = previous.filter(isSale);
  const revenue = sales.reduce((s, o) => s + o.total, 0);
  const prevRevenue = prevSales.reduce((s, o) => s + o.total, 0);
  const aov = sales.length ? revenue / sales.length : 0;
  const prevAov = prevSales.length ? prevRevenue / prevSales.length : 0;

  const toFulfil = orders.filter((o) => isSale(o) && ['Processing', 'Tailoring', 'Quality Check'].includes(o.fulfillmentStatus));
  const failedPayments = current.filter((o) => o.paymentStatus === 'Failed').length;
  const lowStock = products.filter((p) => p.stockCount <= LOW_STOCK_THRESHOLD).sort((a, b) => a.stockCount - b.stockCount);
  const hasSample = orders.some((o) => o.isSample);

  const daily = salesByDay(orders, 30);
  const topProducts = groupSum(
    sales.flatMap((o) => o.items),
    (i) => i.productTitle,
    (i) => i.price * i.quantity
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Last 30 days compared with the 30 days before"
        actions={
          <>
            {hasSample && (
              <button className={styles.btn} onClick={clearSampleOrders}>
                Remove sample data
              </button>
            )}
            <Link href="/admin/products/new" className={styles.btnPrimary}>
              <Plus size={15} /> Add product
            </Link>
          </>
        }
      />

      {orders.length === 0 && (
        <div className={styles.banner}>
          <span>No orders yet. Orders placed through checkout appear here automatically.</span>
          <button className={styles.btn} onClick={loadSampleOrders}>
            <Database size={15} /> Load sample orders
          </button>
        </div>
      )}

      <div className={styles.kpis}>
        <StatTile label="Net sales" value={inr(revenue)} delta={pctChange(revenue, prevRevenue)} hint="vs previous 30d" icon={<IndianRupee size={16} />} />
        <StatTile label="Orders" value={sales.length} delta={pctChange(sales.length, prevSales.length)} hint="vs previous 30d" icon={<ShoppingBag size={16} />} />
        <StatTile label="Avg. order value" value={inr(aov)} delta={pctChange(aov, prevAov)} hint="vs previous 30d" />
        <StatTile label="To fulfil" value={toFulfil.length} hint={`${failedPayments} failed payment${failedPayments === 1 ? '' : 's'} in 30d`} icon={<Truck size={16} />} />
      </div>

      <div className={styles.twoCol}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Daily net sales</h2>
            <Link href="/admin/analytics">Analytics →</Link>
          </div>
          <ColumnChart
            data={daily}
            value={(d) => d.revenue}
            label={(d) => d.label}
            formatValue={(v) => inr(v)}
            formatAxis={(v) => inr(v, true)}
            tooltipExtra={(d) => `${d.orders} order${d.orders === 1 ? '' : 's'}`}
            caption="Daily net sales, last 30 days"
          />
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Top products · 30d</h2>
          </div>
          <BarList rows={topProducts} formatValue={(v) => inr(v, true)} limit={5} />
        </section>
      </div>

      <div className={styles.twoCol}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Recent orders</h2>
            <Link href="/admin/orders">All orders →</Link>
          </div>
          {orders.length === 0 ? (
            <div className={styles.empty}>No orders yet</div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th className={styles.num}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map((o) => (
                    <tr key={o.id} className={styles.rowLink} onClick={() => router.push(`/admin/orders/${o.id}`)}>
                      <td>
                        <Link href={`/admin/orders/${o.id}`} onClick={(e) => e.stopPropagation()}>
                          <strong>{o.orderNumber}</strong>
                        </Link>
                        <div className={styles.muted}>{o.date}</div>
                      </td>
                      <td>{o.customerName}</td>
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

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Low stock</h2>
            <Link href="/admin/products">Products →</Link>
          </div>
          {lowStock.length === 0 ? (
            <div className={styles.empty}>All products have more than {LOW_STOCK_THRESHOLD} in stock</div>
          ) : (
            <div className={styles.barList}>
              {lowStock.slice(0, 6).map((p) => (
                <Link key={p.id} href={`/admin/products/${p.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={p.images[0]} alt="" className={styles.thumb} />
                  <span style={{ flex: 1, minWidth: 0, fontSize: '0.84rem' }}>{p.title}</span>
                  <Badge tone={p.stockCount === 0 ? 'critical' : 'warning'}>
                    {p.stockCount === 0 ? (
                      <>
                        <AlertTriangle size={11} /> Out
                      </>
                    ) : (
                      `${p.stockCount} left`
                    )}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
