'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '@/app/admin/admin.module.css';
import type { Tone } from '@/lib/admin';

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className={styles.pageHeader}>
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}

export function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}

export function StatTile({
  label,
  value,
  delta,
  hint,
  icon
}: {
  label: string;
  value: React.ReactNode;
  delta?: number | null;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`${styles.card} ${styles.stat}`}>
      <div className={styles.statLabel}>
        <span>{label}</span>
        {icon}
      </div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statDelta}>
        {delta != null && Number.isFinite(delta) && (
          <span className={delta >= 0 ? styles.up : styles.down}>
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%{' '}
          </span>
        )}
        {hint}
      </div>
    </div>
  );
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className={styles.segmented} role="group" aria-label={label}>
      {options.map((o) => (
        <button key={String(o.value)} type="button" aria-pressed={o.value === value} className={o.value === value ? styles.segActive : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function niceMax(v: number) {
  if (v <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * pow;
}

/** Single-series column chart for a time series, with per-column hover tooltip and a screen-reader table. */
export function ColumnChart<T>({
  data,
  value,
  label,
  formatValue,
  formatAxis = formatValue,
  tooltipExtra,
  height = 220,
  caption
}: {
  data: T[];
  value: (d: T) => number;
  label: (d: T) => string;
  formatValue: (v: number) => string;
  formatAxis?: (v: number) => string;
  tooltipExtra?: (d: T) => string;
  height?: number;
  caption: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const padL = 52;
  const padB = 24;
  const padT = 8;
  const plotW = Math.max(0, width - padL);
  const plotH = height - padB - padT;
  const max = niceMax(Math.max(...data.map(value), 0));
  const step = data.length ? plotW / data.length : 0;
  const gap = Math.max(2, step * 0.25);
  const barW = Math.max(1, step - gap);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const labelEvery = Math.ceil(data.length / Math.max(1, Math.floor(plotW / 64)));

  const y = (v: number) => padT + plotH - (v / max) * plotH;

  const barPath = (x: number, top: number, w: number) => {
    const base = padT + plotH;
    const h = base - top;
    if (h <= 0) return '';
    const r = Math.min(4, w / 2, h);
    return `M${x},${base} V${top + r} Q${x},${top} ${x + r},${top} H${x + w - r} Q${x + w},${top} ${x + w},${top + r} V${base} Z`;
  };

  return (
    <div className={styles.chart} ref={ref} onMouseLeave={() => setHover(null)}>
      <svg height={height} role="img" aria-label={caption}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={width} y1={y(t)} y2={y(t)} stroke="#ece8df" strokeWidth={1} />
            <text x={padL - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill="#8e8880">
              {formatAxis(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = padL + i * step + gap / 2;
          const v = value(d);
          return (
            <g key={i}>
              <path d={barPath(x, y(v), barW)} fill="#580F00" opacity={hover === null || hover === i ? 1 : 0.45} />
              {i % labelEvery === 0 && (
                <text x={x + barW / 2} y={height - 6} textAnchor="middle" fontSize={11} fill="#8e8880">
                  {label(d)}
                </text>
              )}
              <rect
                x={padL + i * step}
                y={padT}
                width={step}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                aria-label={`${label(d)}: ${formatValue(v)}`}
              />
            </g>
          );
        })}
        <line x1={padL} x2={width} y1={padT + plotH} y2={padT + plotH} stroke="#cfc8ba" strokeWidth={1} />
      </svg>
      {hover !== null && data[hover] && (
        <div className={styles.tooltip} style={{ left: padL + hover * step + step / 2, top: y(value(data[hover])) }}>
          <strong>{formatValue(value(data[hover]))}</strong>
          {label(data[hover])}
          {tooltipExtra && ` · ${tooltipExtra(data[hover])}`}
        </div>
      )}
      <table className={styles.srOnly}>
        <caption>{caption}</caption>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <th scope="row">{label(d)}</th>
              <td>{formatValue(value(d))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Ranked horizontal bars with direct labels; used for category, product, city and method breakdowns. */
export function BarList({
  rows,
  formatValue,
  secondary,
  limit = 6,
  empty = 'No data yet'
}: {
  rows: { label: string; value: number }[];
  formatValue: (v: number) => string;
  secondary?: (row: { label: string; value: number }) => string;
  limit?: number;
  empty?: string;
}) {
  if (!rows.length) return <div className={styles.empty}>{empty}</div>;
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className={styles.barList}>
      {rows.slice(0, limit).map((r) => (
        <div key={r.label} className={styles.barRow} title={`${r.label}: ${formatValue(r.value)}`}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.label}</span>
          <span className={styles.num}>
            <strong>{formatValue(r.value)}</strong>
            {secondary && <span className={styles.muted}> · {secondary(r)}</span>}
          </span>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
