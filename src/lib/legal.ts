/** Business details referenced across the policy pages. Fill in the TODO fields before launch. */
export const LEGAL = {
  brand: 'Heva Elegance',
  website: 'www.hevaelegance.com',
  whatsapp: '+91 8142595131',
  email: 'support@hevaelegance.com', // TODO: confirm support inbox
  address: 'India', // TODO: registered business address
  jurisdiction: 'India', // TODO: city for courts' jurisdiction, e.g. "Hyderabad, Telangana"
  grievanceOfficer: 'Customer Care Team', // TODO: name of Grievance Officer (IT Rules 2021 / DPDP Act 2023)
  lastUpdated: '6 October 2026',
  freeShippingThreshold: 699,
  standardShippingFee: 500,
  expressShippingFee: 800,
  returnWindowDays: 7,
};

export const LEGAL_PAGES = [
  { href: '/pages/shipping-policy', label: 'Shipping Policy' },
  { href: '/pages/return-exchange-policy', label: 'Return & Exchange' },
  { href: '/pages/privacy-policy', label: 'Privacy Policy' },
  { href: '/pages/terms', label: 'Terms & Conditions' },
] as const;

export const INFO_PAGES = [
  { href: '/pages/about-us', label: 'About Us' },
  { href: '/pages/contact-us', label: 'Contact Us' },
  { href: '/pages/size-chart', label: 'Size Guide' },
  { href: '/pages/faq', label: 'FAQ' },
] as const;

/** Garment measurements in inches; mirrors the size guide on product pages. */
export const SIZE_CHART = [
  { size: 'XS', bust: 36, waist: 38, hip: 42, length: 40 },
  { size: 'S', bust: 38, waist: 40, hip: 44, length: 40 },
  { size: 'M', bust: 40, waist: 42, hip: 46, length: 40 },
  { size: 'L', bust: 42, waist: 44, hip: 48, length: 40 },
  { size: 'XL', bust: 44, waist: 46, hip: 50, length: 40 },
  { size: '2XL', bust: 46, waist: 48, hip: 52, length: 40 },
  { size: '3XL', bust: 48, waist: 50, hip: 54, length: 40 },
  { size: '4XL', bust: 50, waist: 52, hip: 56, length: 40 },
] as const;
