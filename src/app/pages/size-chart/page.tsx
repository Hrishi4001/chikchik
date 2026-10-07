import type { Metadata } from 'next';
import PageShell from '@/components/legal/PageShell';
import { ContactNote } from '@/components/legal/PolicyPage';
import { LEGAL, SIZE_CHART } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Size Guide | Heva Elegance',
  description: 'Heva Elegance size chart in inches and centimetres, with tips on how to measure bust, waist, hip and length.',
  alternates: { canonical: '/pages/size-chart' },
};

const cm = (inches: number) => Math.round(inches * 2.54);
const cell = { padding: '0.65rem 0.5rem', borderBottom: '1px solid var(--border-subtle)' } as const;
const head = { padding: '0.75rem 0.5rem', borderBottom: '1.5px solid var(--text-primary)', fontWeight: 600 } as const;

function SizeTable({ unit }: { unit: 'in' | 'cm' }) {
  const fmt = (n: number) => (unit === 'in' ? `${n}"` : `${cm(n)}`);
  return (
    <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
      <table style={{ width: '100%', minWidth: '420px', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'center' }}>
        <caption style={{ textAlign: 'left', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', paddingBottom: '0.5rem' }}>
          Garment measurements ({unit === 'in' ? 'inches' : 'centimetres'})
        </caption>
        <thead>
          <tr>
            <th style={{ ...head, textAlign: 'left' }}>Size</th>
            <th style={head}>Bust</th>
            <th style={head}>Waist</th>
            <th style={head}>Hip</th>
            <th style={head}>Length</th>
          </tr>
        </thead>
        <tbody>
          {SIZE_CHART.map((r) => (
            <tr key={r.size}>
              <td style={{ ...cell, textAlign: 'left', fontWeight: 600 }}>{r.size}</td>
              <td style={cell}>{fmt(r.bust)}</td>
              <td style={cell}>{fmt(r.waist)}</td>
              <td style={cell}>{fmt(r.hip)}</td>
              <td style={cell}>{fmt(r.length)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeChartPage() {
  return (
    <PageShell title="Size Guide" currentHref="/pages/size-chart">
      <p style={{ marginBottom: '2rem' }}>
        The measurements below are actual garment measurements, not body measurements. Compare them with a similar piece
        you already own for the best fit. Lengths may vary by style — check the product page for exact details.
      </p>

      <SizeTable unit="in" />
      <SizeTable unit="cm" />

      <section className="policy-body">
        <h2 style={{ fontFamily: 'var(--font-heading-family)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '0.75rem' }}>How to Measure</h2>
        <ul>
          <li><strong>Bust:</strong> Measure around the fullest part of your bust, keeping the tape parallel to the floor.</li>
          <li><strong>Waist:</strong> Measure around your natural waistline, the narrowest part of your torso.</li>
          <li><strong>Hip:</strong> Stand with feet together and measure around the fullest part of your hips.</li>
          <li><strong>Length:</strong> Measure from the highest point of the shoulder, near the neck, down to the desired hem.</li>
        </ul>
        <p>Keep the tape snug but not tight. Garments include ease, so allow 2–3 inches over your body measurement for a comfortable fit.</p>
      </section>

      <section className="policy-body" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading-family)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '0.75rem' }}>Need Help With Fit?</h2>
        <p>
          Between sizes? Message us on WhatsApp at {LEGAL.whatsapp} with your measurements and we&apos;ll recommend the right size.
          Sarees are free size and suit all body types.
        </p>
      </section>

      <ContactNote />
    </PageShell>
  );
}
