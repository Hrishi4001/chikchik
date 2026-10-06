import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/legal/PageShell';
import { ContactNote } from '@/components/legal/PolicyPage';

export const metadata: Metadata = {
  title: 'About Us | Heva Elegance',
  description: 'Heva Elegance is a clothing brand for women who express confidence with comfort — modern silhouettes rooted in timeless Indian craft.',
  alternates: { canonical: '/pages/about-us' },
};

const VALUES = [
  { title: 'Comfort First', body: 'Breathable fabrics and easy, considered fits you can wear from morning errands to evening celebrations.' },
  { title: 'Timeless Craft', body: 'Handpicked prints, weaves and finishing details that honour Indian textile traditions without feeling dated.' },
  { title: 'Made to Fit You', body: 'Sizes from XS to 4XL, plus a Custom Fit option tailored to your measurements.' },
  { title: 'Honest Quality', body: 'Every piece is quality-checked and carefully packed before it leaves us, so it arrives exactly as you expect.' },
];

export default function AboutUsPage() {
  return (
    <PageShell title="About Us" currentHref="/pages/about-us">
      <div className="policy-body">
        <p style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading-family)' }}>
          Heva Elegance is a clothing brand crafted for women who believe in expressing confidence with comfort.
        </p>
        <p>
          We blend modern styles with timeless elegance, creating outfits that suit every mood — from casual days to special moments.
          At Heva Elegance, fashion isn&rsquo;t just about wearing clothes; it&rsquo;s about feeling empowered in your own skin.
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
        <h2 style={{ fontFamily: 'var(--font-heading-family)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '0.75rem' }}>Our Collections</h2>
        <p>
          From everyday kurtis and co-ord sets to sarees and festive wear, our collections are designed to move with you.
          New styles drop regularly — subscribe to our newsletter to hear about them first.
        </p>
        <Link href="/shop" className="btn-primary" style={{ marginTop: '0.5rem', textDecoration: 'none' }}>Shop the Collection</Link>
      </section>

      <ContactNote />
    </PageShell>
  );
}
