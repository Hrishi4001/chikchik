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
      { q: 'How do I place an order?', a: 'Choose your product, add it to your bag and proceed to checkout. Enter your shipping details, pick a payment method and confirm. You will receive an order confirmation by SMS/email.' },
      { q: 'Which payment methods do you accept?', a: 'We accept UPI, credit and debit cards, net banking and popular wallets through our secure payment gateway.' },
      { q: 'Can I cancel or change my order?', a: `You can cancel or change an order before it is dispatched by messaging us on WhatsApp at ${LEGAL.whatsapp}.` },
    ],
  },
  {
    heading: 'Shipping & Delivery',
    items: [
      { q: 'How much does shipping cost?', a: `Standard shipping is free on orders of ${inr(LEGAL.freeShippingThreshold)} and above. Priority Delivery is available for ${inr(LEGAL.expressShippingFee)}.`, link: { href: '/pages/shipping-policy', label: 'Read the Shipping Policy' } },
      { q: 'How long will my order take to arrive?', a: 'Ready-to-ship orders are dispatched within 1–2 business days and usually arrive within 3–7 business days.' },
      { q: 'How can I track my order?', a: 'Once your order ships, we send the courier name and tracking number by SMS/email so you can follow it until delivery.' },
      { q: 'Do you ship internationally?', a: `We currently ship across India. For international orders, please contact us on WhatsApp at ${LEGAL.whatsapp} before ordering.` },
    ],
  },
  {
    heading: 'Products & Gifting',
    items: [
      { q: 'What are your lighters made of?', a: 'Our lighters have solid metal bodies with a full-wrap matte print of a vintage matchbox label. The material and finish are listed on every product page.' },
      { q: 'Do your lighters come filled?', a: 'Check the Care & safety section on each product page for whether it ships filled and which fuel or refill to use.' },
      { q: 'Can I buy a lighter as a gift?', a: 'Yes. Every lighter comes in a gift-ready box. Message us on WhatsApp if you need help picking a design.' },
      { q: 'Is there an age limit?', a: 'Yes. Our lighters are sold only to customers aged 18 and above.' },
    ],
  },
  {
    heading: 'Returns & Exchanges',
    items: [
      { q: 'What is your return policy?', a: `For safety reasons, lighters that have been filled, lit or used cannot be returned. Unused lighters in their original packaging can be returned within ${LEGAL.returnWindowDays} days of delivery.`, link: { href: '/pages/return-exchange-policy', label: 'Read the Return & Exchange Policy' } },
      { q: 'How long do refunds take?', a: 'Refunds for prepaid orders reach your original payment method within 5–7 business days after the returned item passes quality check.' },
      { q: 'What if I receive a damaged or wrong item?', a: 'Tell us within 48 hours of delivery with photos (an unboxing video helps). We will send a free replacement or a full refund.' },
    ],
  },
  {
    heading: 'Care & Safety',
    items: [
      { q: 'How should I store my lighter?', a: 'Keep it in a cool, dry place away from direct sunlight, heat and flammable materials, and out of reach of children.' },
      { q: 'How do I keep the print looking new?', a: 'Wipe your lighter with a soft, dry cloth and avoid keeping it loose with keys or coins, which can scratch the printed finish.' },
    ],
  },
];
