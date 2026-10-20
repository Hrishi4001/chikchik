import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found | Chikchik',
};

export default function NotFound() {
  return (
    <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem', padding: '4rem 1.5rem' }}>
      <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>404</p>
      <h1 style={{ fontFamily: 'var(--font-heading-family)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 400, color: '#111111' }}>
        Oops, the tape got tangled
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px' }}>
        This page has gone missing like your favourite cassette. Grab a pencil, rewind, and head back to the good stuff.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
        <Link href="/shop" className="btn-primary" style={{ padding: '0.9rem 2rem' }}>Shop the collection</Link>
        <Link href="/" className="btn-secondary" style={{ padding: '0.9rem 2rem' }}>Go home</Link>
      </div>
    </main>
  );
}
