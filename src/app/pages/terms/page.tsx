import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPage from '@/components/legal/PolicyPage';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Chikchik',
  description: 'Terms and conditions governing the use of the Chikchik website and purchases made on it.',
  alternates: { canonical: '/pages/terms' },
};

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      currentHref="/pages/terms"
      intro={
        <p>
          These Terms &amp; Conditions govern your access to and use of {LEGAL.website} (the &ldquo;Website&rdquo;) operated by {LEGAL.brand}, and any purchase you make on it. By browsing the Website or placing an order, you agree to these terms. If you do not agree, please do not use the Website.
        </p>
      }
      sections={[
        {
          heading: 'Eligibility & Account',
          body: (
            <ul>
              <li>You must be at least 18 years old, or use the Website under the supervision of a parent or guardian.</li>
              <li>You are responsible for keeping your account credentials confidential and for all activity under your account.</li>
              <li>You agree to provide accurate and complete information, including your name, contact details and shipping address.</li>
            </ul>
          ),
        },
        {
          heading: 'Products & Descriptions',
          body: <p>We make every effort to display our products, colours, materials and finishes accurately. Metal finishes can age and printed designs may vary slightly between runs; these are not defects. Product images are for illustration; actual colours may vary due to lighting and screen settings.</p>,
        },
        {
          heading: 'Pricing & Payment',
          body: (
            <ul>
              <li>All prices are in Indian Rupees (₹) and inclusive of applicable taxes unless stated otherwise. Shipping charges are shown separately at checkout.</li>
              <li>We may change prices, offers and product availability without prior notice. The price applicable is the one shown at the time you place your order.</li>
              <li>Payments are processed securely through our payment partner via cards, UPI, net banking and wallets.</li>
              <li>In case of an obvious pricing or listing error, we reserve the right to cancel the affected order and refund any amount paid.</li>
            </ul>
          ),
        },
        {
          heading: 'Orders & Acceptance',
          body: <p>Your order is an offer to buy. A contract is formed only when we dispatch the product. We may decline or cancel any order for reasons including stock unavailability, payment issues, suspected fraud or errors in product information. If we cancel a prepaid order, you will receive a full refund.</p>,
        },
        {
          heading: 'Coupons & Offers',
          body: <p>Discount codes and promotional offers are subject to their specific terms, cannot be combined unless stated, have no cash value and may be withdrawn at any time. Misuse of offers may lead to order cancellation.</p>,
        },
        {
          heading: 'Shipping, Returns & Exchanges',
          body: (
            <p>
              Delivery is governed by our <Link href="/pages/shipping-policy">Shipping Policy</Link>, and returns, exchanges, cancellations and refunds by our <Link href="/pages/return-exchange-policy">Return &amp; Exchange Policy</Link>. Both form part of these terms.
            </p>
          ),
        },
        {
          heading: 'Product Use',
          body: <p>Our lighters are sold only to customers aged 18 and above. Keep them out of reach of children, use and refill only as directed, never leave a flame unattended, and keep away from heat and flammable materials.</p>,
        },
        {
          heading: 'Intellectual Property',
          body: <p>All content on the Website, including the {LEGAL.brand} name, logo, product photographs, designs, text and graphics, is owned by or licensed to {LEGAL.brand} and protected by Indian and international intellectual property laws. You may not copy, reproduce, distribute or use it for commercial purposes without our written permission.</p>,
        },
        {
          heading: 'Acceptable Use',
          body: <p>You agree not to misuse the Website, including by attempting unauthorised access, introducing malicious code, scraping content, placing fraudulent orders, or posting unlawful, offensive or misleading reviews.</p>,
        },
        {
          heading: 'Limitation of Liability',
          body: <p>To the extent permitted by law, {LEGAL.brand} is not liable for any indirect, incidental or consequential loss arising from use of the Website or our products. Our total liability for any claim relating to an order is limited to the amount you paid for that order.</p>,
        },
        {
          heading: 'Privacy',
          body: <p>Your use of the Website is also governed by our <Link href="/pages/privacy-policy">Privacy Policy</Link>.</p>,
        },
        {
          heading: 'Governing Law & Disputes',
          body: <p>These terms are governed by the laws of India. Any dispute shall first be attempted to be resolved amicably by contacting us. Failing that, it shall be subject to the exclusive jurisdiction of the courts at {LEGAL.jurisdiction}.</p>,
        },
        {
          heading: 'Changes to These Terms',
          body: <p>We may revise these terms at any time by updating this page. Changes apply to orders placed after the revised terms are posted.</p>,
        },
      ]}
    />
  );
}
