export interface CartMilestone {
  threshold: number; // INR, evaluated on cart subtotal
  label: string;
  perk: string; // only what this milestone adds over the previous one
  discount: number;
  freeShipping: boolean;
}

export const CART_MILESTONES: CartMilestone[] = [
  { threshold: 699, label: 'Free Shipping', perk: 'free shipping', discount: 0, freeShipping: true },
  { threshold: 1300, label: '₹200 Off', perk: '₹200 off', discount: 200, freeShipping: true }
];

export const STANDARD_SHIPPING_FEE = 79;
export const EXPRESS_SHIPPING_FEE = 199;
export const COD_LIMIT = 50000;

export const PROMO_CODES: Record<string, { pct: number; message: string; firstOrderOnly?: boolean }> = {
  ELEGANCE: { pct: 0.1, message: 'Promo code applied: 10% off' },
  ROYAL10: { pct: 0.1, message: 'Promo code applied: 10% off' },
  FIRST15: { pct: 0.15, message: 'First order special: 15% off applied', firstOrderOnly: true }
};

export function getCartRewards(subtotal: number) {
  const unlocked = [...CART_MILESTONES].reverse().find((m) => subtotal >= m.threshold);
  const next = CART_MILESTONES.find((m) => subtotal < m.threshold);
  return {
    unlocked,
    next,
    remainingForNext: next ? next.threshold - subtotal : 0,
    discount: unlocked?.discount ?? 0,
    freeShipping: !!unlocked?.freeShipping
  };
}

/** Single source of truth for order totals; the server re-runs this against its own catalog prices. */
export function computeTotals(subtotal: number, promoCode: string | undefined, shippingMethod: 'standard' | 'express') {
  const rewards = getCartRewards(subtotal);
  const promoDiscount = Math.round(subtotal * (PROMO_CODES[promoCode || '']?.pct ?? 0));
  const milestoneDiscount = rewards.discount;
  const shippingFee = shippingMethod === 'express' ? EXPRESS_SHIPPING_FEE : rewards.freeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const discount = promoDiscount + milestoneDiscount;
  return { subtotal, promoDiscount, milestoneDiscount, discount, shippingFee, total: Math.max(0, subtotal - discount + shippingFee) };
}
