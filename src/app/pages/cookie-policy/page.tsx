import type { Metadata } from 'next';
import PolicyPage from '@/components/legal/PolicyPage';
import CookiePreferencesButton from '@/components/privacy/CookiePreferencesButton';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Cookie Policy | Heva Elegance',
  description: 'Which cookies Heva Elegance uses, why, and how to change your cookie preferences.',
  alternates: { canonical: '/pages/cookie-policy' },
};

const COOKIES = [
  { name: 'he_consent', type: 'Strictly necessary', purpose: 'Remembers your cookie choices', duration: '6 months' },
  { name: 'admin_session', type: 'Strictly necessary', purpose: 'Keeps store staff signed in to the admin console (staff only)', duration: 'Session / up to 7 days' },
  { name: 'svayam_cart, svayam_wishlist (local storage)', type: 'Strictly necessary', purpose: 'Remembers your bag and wishlist on this device', duration: 'Until cleared' },
  { name: 'he_phone_prompt (local storage)', type: 'Strictly necessary', purpose: 'Remembers that you closed the WhatsApp sign-up prompt', duration: 'Until cleared' },
  { name: 'he_vid', type: 'Analytics', purpose: 'A random ID used to tell new and returning visitors apart', duration: '12 months' },
  { name: 'Razorpay cookies', type: 'Strictly necessary (third party)', purpose: 'Fraud prevention and secure payment at checkout', duration: 'Set by Razorpay' },
];

export default function CookiePolicyPage() {
  return (
    <PolicyPage
      title="Cookie Policy"
      currentHref="/pages/cookie-policy"
      intro={
        <p>
          This Cookie Policy explains how {LEGAL.brand} uses cookies and similar technologies on {LEGAL.website}. It should be read together with our <a href="/pages/privacy-policy">Privacy Policy</a>. We ask for your consent before using any cookie that is not strictly necessary, in line with the Digital Personal Data Protection Act, 2023.
        </p>
      }
      sections={[
        {
          heading: 'What Are Cookies?',
          body: <p>Cookies are small text files stored on your device when you visit a website. Similar technologies, such as your browser&rsquo;s local storage, work in the same way. They help a website remember your actions and preferences.</p>,
        },
        {
          heading: 'Types of Cookies We Use',
          body: (
            <ul>
              <li><strong>Strictly necessary:</strong> needed for the store to work: your bag, wishlist, checkout, security, and remembering your cookie choice. These cannot be switched off.</li>
              <li><strong>Analytics (optional):</strong> a random visitor ID that helps us count returning visitors and understand which pages are useful. It does not contain your name, phone or email.</li>
              <li><strong>Marketing (optional):</strong> allows us to show you relevant offers on our site, such as our WhatsApp/SMS sign-up. We do not use third-party advertising cookies.</li>
            </ul>
          ),
        },
        {
          heading: 'Cookies on This Website',
          body: (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: 520 }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '0.5rem 0.5rem 0.5rem 0' }}>Name</th>
                    <th style={{ padding: '0.5rem' }}>Category</th>
                    <th style={{ padding: '0.5rem' }}>Purpose</th>
                    <th style={{ padding: '0.5rem 0 0.5rem 0.5rem' }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.map((c) => (
                    <tr key={c.name} style={{ borderBottom: '1px solid var(--color-border)', verticalAlign: 'top' }}>
                      <td style={{ padding: '0.5rem 0.5rem 0.5rem 0', fontFamily: 'monospace' }}>{c.name}</td>
                      <td style={{ padding: '0.5rem' }}>{c.type}</td>
                      <td style={{ padding: '0.5rem' }}>{c.purpose}</td>
                      <td style={{ padding: '0.5rem 0 0.5rem 0.5rem' }}>{c.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        },
        {
          heading: 'Anonymous Visit Statistics',
          body: <p>To count visits without cookies, our server records the page you viewed, your approximate location (country, state and city derived from your IP address by our hosting provider), device type, browser and the referring website. Your IP address is not stored; it is combined with a random value that changes every day and turned into an irreversible code, so visits cannot be linked to you or across days. These statistics are kept for 180 days.</p>,
        },
        {
          heading: 'Managing Your Preferences',
          body: (
            <>
              <p>You can accept or reject optional cookies when you first visit, and change your choice at any time:</p>
              <p><CookiePreferencesButton /></p>
              <p>You can also delete or block cookies in your browser settings. Blocking strictly necessary cookies may stop the bag and checkout from working.</p>
            </>
          ),
        },
        {
          heading: 'Changes to This Policy',
          body: <p>If we add new cookies or change how we use them, we will update this page and ask for your consent again where required.</p>,
        },
      ]}
    />
  );
}
