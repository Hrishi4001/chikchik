import { LEGAL } from '@/lib/legal';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export interface Faq {
  q: string;
  a: string;
  link?: { href: string; label: string };
}

export const FAQ_GROUPS: { heading: string; items: Faq[] }[] = [
  {
    heading: 'Orders & Payments',
    items: [
      { q: 'How do I place an order?', a: 'Choose your product and size, add it to your bag and proceed to checkout. Enter your shipping details, pick a payment method and confirm. You will receive an order confirmation by SMS/email.' },
      { q: 'Which payment methods do you accept?', a: 'We accept UPI, credit and debit cards, net banking and popular wallets through our secure payment gateway. Cash on Delivery is available on select PIN codes.' },
      { q: 'Can I cancel or change my order?', a: `You can cancel or change an order before it is dispatched by messaging us on WhatsApp at ${LEGAL.whatsapp}. Made-to-measure orders cannot be cancelled once tailoring has begun.` },
    ],
  },
  {
    heading: 'Shipping & Delivery',
    items: [
      { q: 'How much does shipping cost?', a: `Standard shipping is free on orders of ${inr(LEGAL.freeShippingThreshold)} and above. Priority Delivery is available for ${inr(LEGAL.expressShippingFee)}.`, link: { href: '/pages/shipping-policy', label: 'Read the Shipping Policy' } },
      { q: 'How long will my order take to arrive?', a: 'Ready-to-ship orders are dispatched within 1–2 business days and usually arrive within 3–7 business days. Custom-fit orders need about 5 extra business days.' },
      { q: 'How can I track my order?', a: 'Once your order ships, we send the courier name and tracking number by SMS/email so you can follow it until delivery.' },
      { q: 'Do you ship internationally?', a: `We currently ship across India. For international orders, please contact us on WhatsApp at ${LEGAL.whatsapp} before ordering.` },
    ],
  },
  {
    heading: 'Sizing & Fit',
    items: [
      { q: 'How do I find my size?', a: 'Use our Size Guide, which lists garment measurements for every size from XS to 4XL in inches and centimetres.', link: { href: '/pages/size-chart', label: 'Open the Size Guide' } },
      { q: 'Do you offer custom sizing?', a: 'Yes. Select Custom Fit on the product page and our team will contact you on WhatsApp to take your measurements.' },
    ],
  },
  {
    heading: 'Returns & Exchanges',
    items: [
      { q: 'What is your return policy?', a: `Products can be returned or exchanged within ${LEGAL.returnWindowDays} days of delivery if unused, unwashed and with original tags. Custom-fit and final-sale items are not returnable.`, link: { href: '/pages/return-exchange-policy', label: 'Read the Return & Exchange Policy' } },
      { q: 'How long do refunds take?', a: 'Refunds for prepaid orders reach your original payment method within 5–7 business days after the returned item passes quality check.' },
      { q: 'What if I receive a damaged or wrong item?', a: 'Tell us within 48 hours of delivery with photos (an unboxing video helps). We will send a free replacement or a full refund.' },
    ],
  },
  {
    heading: 'Product Care',
    items: [
      { q: 'How should I care for my garments?', a: 'Follow the care label on each piece. Most cotton and printed pieces do best with a gentle cold hand wash, drying in the shade and a warm iron. Dry clean silks and embellished wear.' },
      { q: 'Why does my product look slightly different from the photo?', a: 'Many pieces are hand-printed or handwoven, so small variations in colour or motif are natural. Screen settings can also affect how colours look.' },
    ],
  },
];
