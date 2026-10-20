import type { Metadata } from 'next';
import PageShell from '@/components/legal/PageShell';
import { ContactNote } from '@/components/legal/PolicyPage';
import { FAQ_GROUPS } from '@/lib/faq';
import FaqGroups from '@/components/faq/FaqGroups';

export const metadata: Metadata = {
  title: 'Designer Lighter FAQ | Chikchik',
  description: 'Chikchik designer lighter FAQ: materials, refills, safety, gifting, shipping across India, payments and returns.',
  alternates: { canonical: '/pages/faq' },
};

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_GROUPS.flatMap((g) =>
      g.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    ),
  };

  return (
    <PageShell title="Frequently Asked Questions" currentHref="/pages/faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FaqGroups />
      <ContactNote />
    </PageShell>
  );
}
