import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { INFO_PAGES, LEGAL_PAGES } from '@/lib/legal';

const NAV_GROUPS = [
  { heading: 'Company', links: INFO_PAGES },
  { heading: 'Policies', links: LEGAL_PAGES },
];

/** Breadcrumb + sidebar layout shared by the company and policy pages. */
export default function PageShell({
  title,
  currentHref,
  children,
}: {
  title: string;
  currentHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{title}</span>
      </nav>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start' }}>
        <aside style={{ flex: '0 0 220px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {NAV_GROUPS.map((group) => (
            <div key={group.heading}>
              <h2 style={{ fontFamily: 'var(--font-button-family)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {group.heading}
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {group.links.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      aria-current={p.href === currentHref ? 'page' : undefined}
                      style={{
                        fontFamily: 'var(--font-body-family)',
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)',
                        fontWeight: p.href === currentHref ? 600 : 400,
                        borderBottom: p.href === currentHref ? '1px solid var(--text-primary)' : 'none',
                      }}
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        <article style={{ flex: '1 1 320px', minWidth: 0, maxWidth: '760px', fontFamily: 'var(--font-body-family)', color: 'var(--text-primary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading-family)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 500, letterSpacing: 'var(--font-heading-letter-spacing)', marginBottom: '1.5rem' }}>
            {title}
          </h1>
          {children}
        </article>
      </div>
    </div>
  );
}
