import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/legal/PageShell';
import { ContactNote } from '@/components/legal/PolicyPage';

export const metadata: Metadata = {
  title: 'About Chikchik | Designer Lighters with a 90s Soul',
  description: 'Chikchik makes designer lighters with a 90s soul: vintage Indian matchbox art printed on refillable jet-flame and flip-top lighters. Made for collectors and gifting.',
  alternates: { canonical: '/pages/about-us' },
};

const VALUES = [
  { title: 'Built Like Back Then', body: 'Solid metal bodies, smooth hinges and simple mechanics, made to be used every day and kept for years.' },
  { title: 'Designed with Nostalgia', body: 'Every design starts with a 90s memory: a cassette label, an arcade screen, a comic panel or a pager.' },
  { title: 'Limited Runs', body: 'Designs are made in small runs, like a mixtape recorded one song at a time, so your lighter stays special.' },
  { title: 'Made for Gifting', body: 'Boxed and ready to hand over, for the friend who still has their old Walkman.' },
];

export default function AboutUsPage() {
  return (
    <PageShell title="About Us" currentHref="/pages/about-us">
      <div className="policy-body">
        <p style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading-family)' }}>
          Remember the 90s? Cassettes rewound with a pencil, arcade tokens in your pocket and the satisfying click of a flip-top lighter.
        </p>
        <p>
          Chikchik is our love letter to that time. We design lighters the way things used to be made: solid, simple and full
          of character. Bold colours, retro prints and metal you can feel, each one a small piece of the decade we grew up in.
        </p>
      </div>

      <section style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading-family)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '1.25rem' }}>What We Stand For</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {VALUES.map((v) => (
            <div key={v.title} style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading-family)', fontSize: '1rem', fontWeight: 500, marginBottom: '0.4rem' }}>{v.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="policy-body" style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading-family)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '0.75rem' }}>Our Range</h2>
        <p>
          From windproof jet-flame lighters to classic flip-tops, each printed with a vintage matchbox label, our range covers
          everyday carry, collectors and gifting. Subscribe to our newsletter for new launches and a few throwbacks along the way.
        </p>
        <Link href="/shop" className="btn-primary" style={{ marginTop: '0.5rem', textDecoration: 'none' }}>Press Play on the Range</Link>
      </section>

      <ContactNote />
    </PageShell>
  );
}
