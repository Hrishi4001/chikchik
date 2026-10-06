import React from 'react';
import { LEGAL } from '@/lib/legal';
import PageShell from './PageShell';

export interface PolicySection {
  heading: string;
  body: React.ReactNode;
}

/** Shared layout for the storefront policy pages. */
export default function PolicyPage({
  title,
  intro,
  sections,
  currentHref,
}: {
  title: string;
  intro: React.ReactNode;
  sections: PolicySection[];
  currentHref: string;
}) {
  return (
    <PageShell title={title} currentHref={currentHref}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-1rem', marginBottom: '2rem' }}>Last updated: {LEGAL.lastUpdated}</p>
      <div style={{ marginBottom: '2.5rem' }}>{intro}</div>

      {sections.map((s, i) => (
        <section key={s.heading} style={{ marginBottom: '2.25rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading-family)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '0.75rem' }}>
            {i + 1}. {s.heading}
          </h2>
          <div className="policy-body">{s.body}</div>
        </section>
      ))}

      <ContactNote />
    </PageShell>
  );
}

export function ContactNote() {
  return (
    <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', fontSize: '0.9rem' }}>
      Questions? WhatsApp us at <strong>{LEGAL.whatsapp}</strong> or email{' '}
      <a href={`mailto:${LEGAL.email}`} style={{ textDecoration: 'underline' }}>{LEGAL.email}</a>.
    </div>
  );
}
