export interface CartMilestone {
  threshold: number; // INR, evaluated on cart subtotal
  label: string;
  perk: string; // only what this milestone adds over the previous one
  discount: number;
  freeShipping: boolean;
  gift: boolean;
}

export const CART_MILESTONES: CartMilestone[] = [
  { threshold: 699, label: 'Free Shipping', perk: 'free shipping', discount: 0, freeShipping: true, gift: false },
  { threshold: 1300, label: '₹200 Off', perk: '₹200 off', discount: 200, freeShipping: true, gift: false },
  { threshold: 3500, label: 'Exclusive Gift', perk: 'an exclusive gift', discount: 200, freeShipping: true, gift: true }
];

export const STANDARD_SHIPPING_FEE = 500;

export function getCartRewards(subtotal: number) {
  const unlocked = [...CART_MILESTONES].reverse().find((m) => subtotal >= m.threshold);
  const next = CART_MILESTONES.find((m) => subtotal < m.threshold);
  return {
    unlocked,
    next,
    remainingForNext: next ? next.threshold - subtotal : 0,
    discount: unlocked?.discount ?? 0,
    freeShipping: !!unlocked?.freeShipping,
    gift: !!unlocked?.gift
  };
}
