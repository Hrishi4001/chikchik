import type { Metadata } from 'next';
import PolicyPage from '@/components/legal/PolicyPage';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy | Heva Elegance',
  description: 'How Heva Elegance collects, uses, stores and protects your personal information.',
  alternates: { canonical: '/pages/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      currentHref="/pages/privacy-policy"
      intro={
        <p>
          {LEGAL.brand} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your privacy. This policy explains how we collect, use, share and protect your personal data when you visit {LEGAL.website} or place an order with us, in accordance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023. By using our website, you consent to the practices described here.
        </p>
      }
      sections={[
        {
          heading: 'Information We Collect',
          body: (
            <ul>
              <li><strong>Information you provide:</strong> name, email address, phone number, shipping and billing address, measurements for custom-fit orders, and messages you send us.</li>
              <li><strong>Order information:</strong> products purchased, order value, payment method and transaction status. We do not store your full card, UPI PIN or net-banking credentials; payments are processed by our PCI-DSS compliant payment partner (Razorpay).</li>
              <li><strong>Marketing sign-ups:</strong> your mobile number (and name, if given) when you join our WhatsApp/SMS updates, together with a record of when and how you gave consent.</li>
              <li><strong>Automatically collected data:</strong> approximate location (country, state, city), device and browser type, pages visited, and the website that referred you. Your IP address is used only to derive location and an anonymous daily visit code; it is not stored. See our <a href="/pages/cookie-policy">Cookie Policy</a>.</li>
            </ul>
          ),
        },
        {
          heading: 'How We Use Your Information',
          body: (
            <ul>
              <li>To process, ship and deliver your orders, and to handle returns, exchanges and refunds.</li>
              <li>To communicate order updates by SMS, email or WhatsApp.</li>
              <li>To respond to your queries and provide customer support.</li>
              <li>To send newsletters and offers by email, SMS or WhatsApp, only where you have given separate, explicit consent. You can unsubscribe at any time by replying STOP or contacting us.</li>
              <li>To produce aggregated visitor statistics (for example, number of visitors and which countries they come from).</li>
              <li>To improve our website, products and services, and to prevent fraud and misuse.</li>
              <li>To comply with legal, tax and accounting obligations.</li>
            </ul>
          ),
        },
        {
          heading: 'Sharing Your Information',
          body: (
            <>
              <p>We do not sell or rent your personal data. We share it only as needed with:</p>
              <ul>
                <li>Payment gateways, to process payments securely.</li>
                <li>Courier and logistics partners, to deliver and pick up your orders.</li>
                <li>Technology providers that host our website, send communications or provide analytics, under confidentiality obligations.</li>
                <li>Government or law-enforcement authorities, where required by law.</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Cookies',
          body: <p>We use strictly necessary cookies to remember your cart, wishlist and cookie choice. Analytics and marketing cookies are used only if you accept them in our cookie banner, and you can change your choice any time via &ldquo;Cookie Preferences&rdquo; in the footer. Full details are in our <a href="/pages/cookie-policy">Cookie Policy</a>.</p>,
        },
        {
          heading: 'Data Retention & Security',
          body: <p>We keep your personal data only as long as needed for the purposes above or as required by law (for example, invoice records for tax purposes). Visitor statistics are deleted after 180 days. Marketing phone numbers are kept until you withdraw consent, and are deleted within 30 days of your request. We use reasonable technical and organisational safeguards, including encrypted (HTTPS) connections, to protect your data. No method of transmission over the internet is completely secure, but we work to protect your information.</p>,
        },
        {
          heading: 'Your Rights',
          body: (
            <>
              <p>You may at any time:</p>
              <ul>
                <li>Access, correct or update your personal data by contacting us.</li>
                <li>Request deletion of your account and personal data, subject to legal retention requirements.</li>
                <li>Withdraw consent for marketing communications or optional cookies at any time. Withdrawing is as easy as giving consent, and does not affect processing that happened before.</li>
                <li>Have your grievance redressed, and if unresolved, complain to the Data Protection Board of India.</li>
                <li>Nominate another person to exercise your rights in case of death or incapacity.</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Children's Privacy",
          body: <p>Our website is not intended for children under 18. We do not knowingly collect personal data from children without verifiable parental consent.</p>,
        },
        {
          heading: 'Grievance Officer',
          body: (
            <p>
              For any concern or complaint about your personal data, contact our Grievance Officer:<br />
              <strong>{LEGAL.grievanceOfficer}</strong>, {LEGAL.brand}<br />
              Email: <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> · WhatsApp: {LEGAL.whatsapp}<br />
              Address: {LEGAL.address}<br />
              We will acknowledge your complaint within 48 hours and aim to resolve it within 30 days.
            </p>
          ),
        },
        {
          heading: 'Changes to This Policy',
          body: <p>We may update this policy from time to time. Changes will be posted on this page with a revised &ldquo;Last updated&rdquo; date. Continued use of the website after changes means you accept the updated policy.</p>,
        },
      ]}
    />
  );
}
