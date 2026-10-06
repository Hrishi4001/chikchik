import Link from 'next/link';
import { FAQ_GROUPS } from '@/lib/faq';

export default function FaqGroups() {
  return (
    <>
      {FAQ_GROUPS.map((group) => (
        <section key={group.heading} style={{ marginBottom: '2.25rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading-family)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '0.5rem' }}>{group.heading}</h2>
          {group.items.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>{f.q}</summary>
              <div className="policy-body" style={{ paddingBottom: '1rem' }}>
                <p>{f.a}</p>
                {f.link && <Link href={f.link.href}>{f.link.label}</Link>}
              </div>
            </details>
          ))}
        </section>
      ))}
    </>
  );
}
