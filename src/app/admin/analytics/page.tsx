'use client';

import React, { useMemo, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { BarList, ColumnChart, PageHeader, Segmented, StatTile } from '@/components/admin/ui';
import { filterByDays, FULFILLMENT_FLOW, groupSum, inr, isSale, itemCount, pctChange, returningCustomers, salesByDay } from '@/lib/admin';
import styles from '../admin.module.css';

type Range = 7 | 30 | 90;
type Metric = 'revenue' | 'orders';

export default function AdminAnalyticsPage() {
  const { orders } = useStore();
  const [range, setRange] = useState<Range>(30);
  const [metric, setMetric] = useState<Metric>('revenue');

  const current = useMemo(() => filterByDays(orders, range), [orders, range]);
  const previous = useMemo(() => filterByDays(orders, range, range), [orders, range]);
  const sales = current.filter(isSale);
  const prevSales = previous.filter(isSale);

  const revenue = sales.reduce((s, o) => s + o.total, 0);
  const prevRevenue = prevSales.reduce((s, o) => s + o.total, 0);
  const units = sales.reduce((s, o) => s + itemCount(o), 0);
  const prevUnits = prevSales.reduce((s, o) => s + itemCount(o), 0);
  const discounts = sales.reduce((s, o) => s + o.discount, 0);
  const customers = new Set(sales.map((o) => o.customerEmail.toLowerCase())).size;

  const repeat = returningCustomers(orders, range);

  const daily = salesByDay(orders, range);
  const items = sales.flatMap((o) => o.items);
  const itemsTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const byCategory = groupSum(items, (i) => i.category || 'Uncategorised', (i) => i.price * i.quantity);
  const topProducts = groupSum(items, (i) => i.productTitle, (i) => i.price * i.quantity);
  const topProductUnits = new Map(groupSum(items, (i) => i.productTitle, (i) => i.quantity).map((r) => [r.label, r.value]));
  const byCity = groupSum(sales, (o) => o.shippingAddress.city, (o) => o.total);
  const byMethod = groupSum(sales, (o) => o.paymentMethod, () => 1);
  const bySize = groupSum(items, (i) => String(i.size), (i) => i.quantity);
  const pipeline = [...FULFILLMENT_FLOW, 'Cancelled' as const].map((s) => ({ label: s, value: current.filter((o) => o.fulfillmentStatus === s).length }));
  const promoUsage = groupSum(sales.filter((o) => o.promoCode), (o) => o.promoCode!, (o) => o.discount);

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle={`Last ${range} days compared with the ${range} days before`}
        actions={
          <Segmented
            label="Date range"
            value={range}
            onChange={setRange}
            options={[
              { value: 7, label: '7 days' },
              { value: 30, label: '30 days' },
              { value: 90, label: '90 days' }
            ]}
          />
        }
      />

      <div className={styles.kpis}>
        <StatTile label="Net sales" value={inr(revenue)} delta={pctChange(revenue, prevRevenue)} />
        <StatTile label="Orders" value={sales.length} delta={pctChange(sales.length, prevSales.length)} />
        <StatTile label="Units sold" value={units} delta={pctChange(units, prevUnits)} />
        <StatTile label="Customers" value={customers} hint={`${repeat} returning`} />
        <StatTile label="Discounts given" value={inr(discounts)} hint={revenue ? `${((discounts / (revenue + discounts)) * 100).toFixed(1)}% of gross` : undefined} />
      </div>

      <section className={styles.card} style={{ marginBottom: '1rem' }}>
        <div className={styles.cardHeader}>
          <h2>{metric === 'revenue' ? 'Net sales per day' : 'Orders per day'}</h2>
          <Segmented
            label="Metric"
            value={metric}
            onChange={setMetric}
            options={[
              { value: 'revenue', label: 'Sales' },
              { value: 'orders', label: 'Orders' }
            ]}
          />
        </div>
        <ColumnChart
          data={daily}
          value={(d) => (metric === 'revenue' ? d.revenue : d.orders)}
          label={(d) => d.label}
          formatValue={(v) => (metric === 'revenue' ? inr(v) : `${v} order${v === 1 ? '' : 's'}`)}
          formatAxis={(v) => (metric === 'revenue' ? inr(v, true) : String(Math.round(v * 10) / 10))}
          tooltipExtra={(d) => (metric === 'revenue' ? `${d.orders} orders` : inr(d.revenue))}
          height={260}
          caption={`${metric === 'revenue' ? 'Net sales' : 'Orders'} per day, last ${range} days`}
        />
      </section>

      <div className={styles.halves}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Sales by category</h2>
          </div>
          <BarList rows={byCategory} formatValue={(v) => inr(v, true)} secondary={(r) => `${itemsTotal ? Math.round((r.value / itemsTotal) * 100) : 0}%`} />
        </section>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Top products</h2>
          </div>
          <BarList rows={topProducts} formatValue={(v) => inr(v, true)} secondary={(r) => `${topProductUnits.get(r.label) || 0} sold`} limit={8} />
        </section>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Top cities</h2>
          </div>
          <BarList rows={byCity} formatValue={(v) => inr(v, true)} limit={8} />
        </section>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Payment methods</h2>
          </div>
          <BarList rows={byMethod} formatValue={(v) => `${v} orders`} secondary={(r) => `${sales.length ? Math.round((r.value / sales.length) * 100) : 0}%`} />
        </section>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Fulfilment pipeline</h2>
          </div>
          <BarList rows={pipeline} formatValue={(v) => `${v}`} limit={6} />
        </section>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Sizes sold</h2>
          </div>
          <BarList rows={bySize} formatValue={(v) => `${v} units`} limit={8} />
        </section>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Promo codes</h2>
          </div>
          <BarList rows={promoUsage} formatValue={(v) => `${inr(v)} off`} empty="No promo codes used in this period" />
        </section>
      </div>
    </>
  );
}
