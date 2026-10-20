import type { Metadata } from 'next';
import PolicyPage from '@/components/legal/PolicyPage';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Shipping Policy | Chikchik',
  description: 'Delivery timelines, shipping charges and tracking for Chikchik designer lighter orders across India.',
  alternates: { canonical: '/pages/shipping-policy' },
};

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      currentHref="/pages/shipping-policy"
      intro={<p>Every Chikchik order is quality-checked, carefully packed and shipped fully insured. This policy explains how and when your order reaches you.</p>}
      sections={[
        {
          heading: 'Shipping Charges',
          body: (
            <ul>
              <li><strong>Standard Insured Delivery:</strong> Free on orders of {inr(LEGAL.freeShippingThreshold)} and above; a flat {inr(LEGAL.standardShippingFee)} on orders below that.</li>
              <li><strong>Priority Delivery:</strong> {inr(LEGAL.expressShippingFee)} per order, dispatched within 24 hours of confirmation.</li>
              <li>All prices on our website are inclusive of applicable taxes. Shipping charges are shown at checkout before you pay.</li>
            </ul>
          ),
        },
        {
          heading: 'Processing & Delivery Timelines',
          body: (
            <>
              <ul>
                <li>Ready-to-ship orders are processed within 1–2 business days (within 24 hours for Priority Delivery).</li>
                <li>Once dispatched, delivery typically takes 3–7 business days depending on your PIN code.</li>
                <li>Products are handmade in small batches; if an item needs a fresh batch, we will let you know the expected dispatch date.</li>
              </ul>
              <p>The estimated delivery date shown at checkout is indicative. Business days exclude Sundays and public holidays. Delays caused by courier partners, weather, strikes or other events outside our control may occur, and we will keep you informed.</p>
            </>
          ),
        },
        {
          heading: 'Serviceable Locations',
          body: <p>We currently ship across India through trusted courier partners. Enter your PIN code on the product or checkout page to check serviceability. For international orders, please contact us on WhatsApp at {LEGAL.whatsapp} before placing your order.</p>,
        },
        {
          heading: 'Order Tracking',
          body: <p>Once your order is dispatched, you will receive the courier name and tracking number by SMS/email.</p>,
        },
        {
          heading: 'Receiving Your Parcel',
          body: (
            <ul>
              <li>Please do not accept a parcel that appears tampered with, damaged or opened. Refuse delivery and inform us immediately.</li>
              <li>We recommend recording an unboxing video when opening your parcel; it helps us resolve any claim of damage or missing items quickly.</li>
              <li>Any transit damage or missing item must be reported within 48 hours of delivery.</li>
            </ul>
          ),
        },
        {
          heading: 'Failed Deliveries',
          body: <p>If a delivery fails due to an incorrect address, unavailability or refusal of a prepaid order, the parcel will be returned to us. Re-shipping charges may apply.</p>,
        },
      ]}
    />
  );
}
