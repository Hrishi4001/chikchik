import type { Metadata } from 'next';
import PolicyPage from '@/components/legal/PolicyPage';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Return & Exchange Policy | Heva Elegance',
  description: `Easy ${LEGAL.returnWindowDays}-day exchange and return policy for Heva Elegance sarees and kurta sets. Eligibility, process and refund timelines.`,
  alternates: { canonical: '/pages/return-exchange-policy' },
};

export default function ReturnExchangePolicyPage() {
  const days = LEGAL.returnWindowDays;
  return (
    <PolicyPage
      title="Return & Exchange Policy"
      currentHref="/pages/return-exchange-policy"
      intro={<p>If you are unhappy with your purchase, we are here to find you an easy solution. Heva Elegance products can be returned or exchanged within {days} days of delivery, subject to the conditions below.</p>}
      sections={[
        {
          heading: 'Eligibility',
          body: (
            <>
              <p>A return or exchange request must be raised within <strong>{days} days of delivery</strong>. The product must be:</p>
              <ul>
                <li>Unused, unwashed, unaltered and free of perfume, makeup or stains.</li>
                <li>Returned with all original tags, labels, packaging, blouse piece and accessories intact.</li>
                <li>Accompanied by the invoice or order number.</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Non-Returnable Items',
          body: (
            <ul>
              <li>Made-to-measure, custom-fit or altered garments (including stitched blouses and fall/pico work done on request).</li>
              <li>Products purchased during clearance or final sale, where marked as non-returnable.</li>
              <li>Gift cards and accessories such as jewellery, for hygiene reasons.</li>
              <li>Items that show signs of use or are returned without original tags.</li>
            </ul>
          ),
        },
        {
          heading: 'Exchanges',
          body: <p>You may exchange a product for another size, or for another product of the same or higher value. If the new product is of higher value, you pay the difference. Exchanges are subject to stock availability; if the requested item is unavailable, we will issue store credit or a refund.</p>,
        },
        {
          heading: 'How to Request a Return or Exchange',
          body: (
            <ul>
              <li>Message us on WhatsApp at <strong>{LEGAL.whatsapp}</strong> or email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> with your order number, the item, the reason and clear photos of the product.</li>
              <li>Once approved, we will arrange a reverse pickup where serviceable. Where reverse pickup is unavailable, you may self-ship the product to the address we share.</li>
              <li>Pack the product securely in its original packaging. We are not responsible for items lost in transit when self-shipped without tracking.</li>
            </ul>
          ),
        },
        {
          heading: 'Quality Check',
          body: <p>All returned products go through a quality check within 2–3 business days of reaching us. If the product does not meet the eligibility conditions, it will be sent back to you and the request will be declined.</p>,
        },
        {
          heading: 'Refunds',
          body: (
            <ul>
              <li>Approved refunds for prepaid orders are made to the original payment method within 5–7 business days of the quality check. Your bank may take additional time to reflect the amount.</li>
              <li>For Cash on Delivery orders, refunds are made by bank transfer/UPI to the account details you provide.</li>
              <li>Original shipping charges and COD fees, if any, are non-refundable unless the product was damaged, defective or incorrect.</li>
              <li>You may choose store credit instead of a refund; store credit is valid for 12 months.</li>
            </ul>
          ),
        },
        {
          heading: 'Damaged, Defective or Wrong Products',
          body: <p>If you receive a damaged, defective or incorrect product, notify us within 48 hours of delivery with photos and, ideally, an unboxing video. We will arrange a free replacement or a full refund including shipping charges.</p>,
        },
        {
          heading: 'Handcrafted Nature of Our Products',
          body: <p>Many of our sarees and kurtas are handwoven, hand-printed or hand-embroidered. Slight irregularities in weave, print, colour or motif are a hallmark of handcraft and are not considered defects. Colours may also vary slightly due to photography and screen settings.</p>,
        },
        {
          heading: 'Order Cancellations',
          body: <p>You may cancel an order before it is dispatched by contacting us; prepaid amounts will be refunded in full. Made-to-measure orders cannot be cancelled once tailoring has begun. Orders already dispatched cannot be cancelled but may be returned under this policy.</p>,
        },
      ]}
    />
  );
}
