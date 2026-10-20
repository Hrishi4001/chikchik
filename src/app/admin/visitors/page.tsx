'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { BarList, Badge, ColumnChart, PageHeader, Segmented, StatTile } from '@/components/admin/ui';
import { downloadCsv, formatDateTime, groupSum, pctChange } from '@/lib/admin';
import styles from '../admin.module.css';

type Range = 7 | 30 | 90;

interface Visit {
  t: number;
  vh: string;
  returning: boolean;
  path: string;
  country: string;
  region?: string;
  city?: string;
  device: string;
  browser?: string;
  referrer?: string;
}
interface ConsentRecord {
  t: number;
  analytics: boolean;
  marketing: boolean;
  country: string;
}
interface Lead {
  id: string;
  t: number;
  phone: string;
  name?: string;
  source: string;
  whatsappOptIn: boolean;
  country: string;
  policyVersion: string;
}
interface Data {
  visits: Visit[];
  consents: ConsentRecord[];
  leads: Lead[];
}

const regionNames = typeof Intl !== 'undefined' && 'DisplayNames' in Intl ? new Intl.DisplayNames(['en'], { type: 'region' }) : null;
function countryName(code: string) {
  if (code === 'Unknown') return 'Unknown (local / no CDN)';
  try {
    return regionNames?.of(code) || code;
  } catch {
    return code;
  }
}

function inWindow<T extends { t: number }>(rows: T[], days: number, offsetDays = 0) {
  const end = Date.now() - offsetDays * 86400000;
  const start = end - days * 86400000;
  return rows.filter((r) => r.t > start && r.t <= end);
}

/** Unique visitors are counted per day: the anonymous visit hash rotates daily, so the same person on two days counts twice. */
function uniqueVisitors(visits: Visit[]) {
  return new Set(visits.map((v) => `${new Date(v.t).toISOString().slice(0, 10)}|${v.vh}`)).size;
}

export default function AdminVisitorsPage() {
  const [range, setRange] = useState<Range>(30);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/visitors?days=${range}`, { cache: 'no-store' }).catch(() => null);
    if (!res?.ok) return setError('Could not load visitor data');
    setError('');
    setData(await res.json());
  }, [range]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on mount / range change
    load();
  }, [load]);

  const stats = useMemo(() => {
    if (!data) return null;
    const visits = inWindow(data.visits, range);
    const prev = inWindow(data.visits, range, range);
    const consents = inWindow(data.consents, range);
    const visitors = uniqueVisitors(visits);
    const prevVisitors = uniqueVisitors(prev);

    // First view of each visitor per day decides their country/device so they're counted once
    const firstViews = new Map<string, Visit>();
    for (const v of visits) {
      const key = `${new Date(v.t).toISOString().slice(0, 10)}|${v.vh}`;
      if (!firstViews.has(key)) firstViews.set(key, v);
    }
    const people = [...firstViews.values()];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daily = Array.from({ length: range }, (_, i) => {
      const d = new Date(today.getTime() - (range - 1 - i) * 86400000);
      return { key: d.toDateString(), label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), visitors: 0, views: 0 };
    });
    const byDay = new Map(daily.map((d) => [d.key, d]));
    for (const v of visits) {
      const b = byDay.get(new Date(v.t).toDateString());
      if (b) b.views += 1;
    }
    for (const p of people) {
      const b = byDay.get(new Date(p.t).toDateString());
      if (b) b.visitors += 1;
    }

    const returningIds = new Set(visits.filter((v) => v.returning).map((v) => v.vh));
    const consentTotal = consents.length;
    const acceptedAll = consents.filter((c) => c.analytics && c.marketing).length;
    const rejected = consents.filter((c) => !c.analytics && !c.marketing).length;

    return {
      visitors,
      prevVisitors,
      views: visits.length,
      prevViews: prev.length,
      returning: returningIds.size,
      daily,
      countries: groupSum(people, (p) => countryName(p.country), () => 1),
      cities: groupSum(
        people.filter((p) => p.city),
        (p) => [p.city, p.region, p.country].filter(Boolean).join(', '),
        () => 1
      ),
      pages: groupSum(visits, (v) => v.path, () => 1),
      devices: groupSum(people, (p) => p.device[0].toUpperCase() + p.device.slice(1), () => 1),
      browsers: groupSum(people, (p) => p.browser || 'Other', () => 1),
      referrers: groupSum(people, (p) => p.referrer || 'Direct / none', () => 1),
      consentRows: [
        { label: 'Accepted all', value: acceptedAll },
        { label: 'Customised', value: consentTotal - acceptedAll - rejected },
        { label: 'Rejected non-essential', value: rejected }
      ].filter((r) => r.value),
      consentTotal,
      analyticsRate: consentTotal ? Math.round((consents.filter((c) => c.analytics).length / consentTotal) * 100) : 0,
      marketingRate: consentTotal ? Math.round((consents.filter((c) => c.marketing).length / consentTotal) * 100) : 0,
      newLeads: inWindow(data.leads, range).length
    };
  }, [data, range]);

  const removeLead = async (lead: Lead) => {
    if (!window.confirm(`Delete ${lead.phone}? Do this when the customer asks to be removed.`)) return;
    const res = await fetch(`/api/admin/visitors?lead=${lead.id}`, { method: 'DELETE' });
    if (res.ok) load();
  };

  const exportLeads = () => {
    if (!data) return;
    downloadCsv(`chikchik-phone-leads-${new Date().toISOString().slice(0, 10)}.csv`, [
      ['Phone', 'Name', 'WhatsApp opt-in', 'Source', 'Country', 'Consent given', 'Policy version'],
      ...data.leads.map((l) => [l.phone, l.name || '', l.whatsappOptIn ? 'Yes' : 'No', l.source, l.country, new Date(l.t).toISOString(), l.policyVersion])
    ]);
  };

  const pct = (n: number, total: number) => `${total ? Math.round((n / total) * 100) : 0}%`;

  return (
    <>
      <PageHeader
        title="Visitors"
        subtitle={`Traffic, locations, cookie consent and phone sign-ups — last ${range} days`}
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

      {error && <div className={styles.empty}>{error}</div>}
      {!stats ? (
        !error && <div className={styles.empty}>Loading…</div>
      ) : (
        <>
          <div className={styles.kpis}>
            <StatTile label="Visitors" value={stats.visitors.toLocaleString('en-IN')} delta={pctChange(stats.visitors, stats.prevVisitors)} hint="unique per day" />
            <StatTile label="Page views" value={stats.views.toLocaleString('en-IN')} delta={pctChange(stats.views, stats.prevViews)} />
            <StatTile label="Views per visitor" value={stats.visitors ? (stats.views / stats.visitors).toFixed(1) : '—'} />
            <StatTile label="Returning visitors" value={stats.returning} hint="cookie-consented only" />
            <StatTile label="Countries" value={stats.countries.filter((c) => !c.label.startsWith('Unknown')).length} />
            <StatTile label="Phone sign-ups" value={stats.newLeads} hint={`${data!.leads.length} total`} />
          </div>

          <section className={styles.card} style={{ marginBottom: '1rem' }}>
            <div className={styles.cardHeader}>
              <h2>Visitors per day</h2>
            </div>
            <ColumnChart
              data={stats.daily}
              value={(d) => d.visitors}
              label={(d) => d.label}
              formatValue={(v) => `${v} visitor${v === 1 ? '' : 's'}`}
              formatAxis={(v) => String(Math.round(v * 10) / 10)}
              tooltipExtra={(d) => `${d.views} page views`}
              height={240}
              caption={`Unique visitors per day, last ${range} days`}
            />
          </section>

          <div className={styles.halves}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Where visitors are from</h2>
              </div>
              <BarList rows={stats.countries} formatValue={(v) => `${v}`} secondary={(r) => pct(r.value, stats.visitors)} limit={10} />
            </section>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Top cities</h2>
              </div>
              <BarList rows={stats.cities} formatValue={(v) => `${v}`} limit={10} empty="City data appears once deployed behind Vercel or Cloudflare" />
            </section>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Top pages</h2>
              </div>
              <BarList rows={stats.pages} formatValue={(v) => `${v} view${v === 1 ? '' : 's'}`} limit={10} />
            </section>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Traffic sources</h2>
              </div>
              <BarList rows={stats.referrers} formatValue={(v) => `${v}`} secondary={(r) => pct(r.value, stats.visitors)} limit={8} />
            </section>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Devices</h2>
              </div>
              <BarList rows={stats.devices} formatValue={(v) => `${v}`} secondary={(r) => pct(r.value, stats.visitors)} />
            </section>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Browsers</h2>
              </div>
              <BarList rows={stats.browsers} formatValue={(v) => `${v}`} secondary={(r) => pct(r.value, stats.visitors)} />
            </section>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Cookie consent</h2>
                <span className={styles.muted}>{stats.consentTotal} choices</span>
              </div>
              <BarList rows={stats.consentRows} formatValue={(v) => `${v}`} secondary={(r) => pct(r.value, stats.consentTotal)} empty="No cookie choices recorded in this period" />
              {stats.consentTotal > 0 && (
                <p className={styles.muted} style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>
                  Analytics allowed by {stats.analyticsRate}% · Marketing allowed by {stats.marketingRate}%
                </p>
              )}
            </section>
          </div>

          <section className={styles.card} style={{ marginTop: '1rem' }}>
            <div className={styles.cardHeader}>
              <h2>Phone sign-ups</h2>
              <button type="button" className={styles.btn} onClick={exportLeads} disabled={!data!.leads.length}>
                <Download size={15} /> Export CSV
              </button>
            </div>
            {data!.leads.length === 0 ? (
              <div className={styles.empty}>No phone numbers collected yet. The sign-up prompt shows to visitors who allow marketing cookies.</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Phone</th>
                      <th>Name</th>
                      <th>Channel</th>
                      <th>Country</th>
                      <th>Consented</th>
                      <th aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {data!.leads.map((l) => (
                      <tr key={l.id}>
                        <td className={styles.mono}>{l.phone}</td>
                        <td>{l.name || <span className={styles.muted}>—</span>}</td>
                        <td>
                          <Badge tone={l.whatsappOptIn ? 'good' : 'neutral'}>{l.whatsappOptIn ? 'WhatsApp + SMS' : 'SMS'}</Badge>
                        </td>
                        <td>{countryName(l.country)}</td>
                        <td>
                          {formatDateTime(new Date(l.t).toISOString())}
                          <div className={styles.muted}>policy {l.policyVersion}</div>
                        </td>
                        <td className={styles.num}>
                          <button type="button" className={styles.iconBtn} aria-label={`Delete ${l.phone}`} onClick={() => removeLead(l)}>
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}
