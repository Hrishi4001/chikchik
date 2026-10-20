import { EXPRESS_SHIPPING_FEE, STANDARD_SHIPPING_FEE } from './cartRewards';

/** Business details referenced across the policy pages. Fill in the TODO fields before launch. */
export const LEGAL = {
  brand: 'Chikchik',
  website: 'www.chikchik.in',
  whatsapp: '+91 9663211070',
  email: 'hello@chikchik.in',
  address: 'India', // TODO: registered business address
  jurisdiction: 'India', // TODO: city for courts' jurisdiction, e.g. "Hyderabad, Telangana"
  grievanceOfficer: 'Customer Care Team', // TODO: name of Grievance Officer (IT Rules 2021 / DPDP Act 2023)
  lastUpdated: '7 October 2026',
  freeShippingThreshold: 499,
  standardShippingFee: STANDARD_SHIPPING_FEE,
  expressShippingFee: EXPRESS_SHIPPING_FEE,
  returnWindowDays: 7,
};

export const LEGAL_PAGES = [
  { href: '/pages/shipping-policy', label: 'Shipping Policy' },
  { href: '/pages/return-exchange-policy', label: 'Return & Exchange' },
  { href: '/pages/privacy-policy', label: 'Privacy Policy' },
  { href: '/pages/cookie-policy', label: 'Cookie Policy' },
  { href: '/pages/terms', label: 'Terms & Conditions' },
] as const;

export const INFO_PAGES = [
  { href: '/pages/about-us', label: 'About Us' },
  { href: '/pages/contact-us', label: 'Contact Us' },
  { href: '/pages/faq', label: 'FAQ' },
] as const;
