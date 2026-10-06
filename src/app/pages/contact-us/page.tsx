import type { Metadata } from 'next';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import PageShell from '@/components/legal/PageShell';
import ContactForm from '@/components/legal/ContactForm';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Contact Us | Heva Elegance',
  description: 'Get in touch with Heva Elegance on WhatsApp or email for orders, sizing, returns and custom-fit requests.',
  alternates: { canonical: '/pages/contact-us' },
};

export default function ContactUsPage() {
  const details = [
    { icon: MessageCircle, label: 'WhatsApp / Phone', value: LEGAL.whatsapp, href: `https://wa.me/${LEGAL.whatsapp.replace(/\D/g, '')}` },
    { icon: Mail, label: 'Email', value: LEGAL.email, href: `mailto:${LEGAL.email}` },
    { icon: MapPin, label: 'Address', value: LEGAL.address },
  ];

  return (
    <PageShell title="Contact Us" currentHref="/pages/contact-us">
      <p style={{ marginBottom: '2rem' }}>
        Have a question about an order, sizing or a custom fit? We&rsquo;re happy to help. Reach us directly or send a message
        below — we usually reply within one business day (Monday–Saturday, 10 AM–7 PM IST).
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {details.map(({ icon: Icon, label, value, href }) => (
          <div key={label} style={{ padding: '1.25rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px' }}>
            <Icon size={18} aria-hidden />
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0.6rem 0 0.25rem' }}>{label}</div>
            {href ? (
              <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ fontWeight: 500, wordBreak: 'break-word' }}>{value}</a>
            ) : (
              <span style={{ fontWeight: 500 }}>{value}</span>
            )}
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: 'var(--font-heading-family)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '1rem' }}>Send Us a Message</h2>
      <ContactForm />
    </PageShell>
  );
}
