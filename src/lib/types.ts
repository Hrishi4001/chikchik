export type Currency = 'INR';

export type SizeOption = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | '4XL' | 'Custom Fit' | string;

export interface StitchingOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  location?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number; // in INR
  compareAtPrice?: number;
  category: 'sarees' | 'kurtas' | 'lehengas' | 'anarkalis' | 'coords' | 'tops' | 'dresses' | 'tunics' | 'sets' | 'bottoms' | 'essentials' | 'festive' | string;
  categoryLabel: string;
  fabric: string;
  craft: string;
  origin: string;
  color: string;
  colorHex: string;
  images: string[];
  description: string;
  craftsmanshipDetails: string[];
  washCare: string[];
  sizes: SizeOption[];
  inStock: boolean;
  stockCount: number;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isHandwoven?: boolean;
  artisanHours?: number;
  stitchingOptions?: StitchingOption[];
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: SizeOption;
  selectedStitching?: StitchingOption;
  customMeasurements?: {
    bust?: string;
    waist?: string;
    hip?: string;
    blouseLength?: string;
  };
  quantity: number;
  unitPrice: number;
}

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  size: SizeOption;
  quantity: number;
  price: number;
  category?: string;
  stitching?: string;
}

export type PaymentMethod = 'UPI' | 'Card' | 'NetBanking' | 'Wallet' | 'COD';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';
export type FulfillmentStatus = 'Processing' | 'Tailoring' | 'Quality Check' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface PaymentAttempt {
  id: string;
  at: string; // ISO
  status: 'Created' | 'Captured' | 'Failed';
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  method?: PaymentMethod;
  reason?: string;
}

export interface PaymentInfo {
  provider: 'razorpay' | 'mock' | 'cod';
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  attempts: PaymentAttempt[];
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
}

export interface OrderEvent {
  at: string; // ISO
  label: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string; // display date
  createdAt: string; // ISO, used for analytics
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: UserAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  shippingFee: number;
  shippingMethod?: 'standard' | 'express';
  total: number; // always INR
  currency: Currency;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  payment?: PaymentInfo;
  fulfillmentStatus: FulfillmentStatus;
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery: string;
  history?: OrderEvent[];
  isSample?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  provider: 'google' | 'apple' | 'otp' | 'email';
  avatar?: string;
  addresses: UserAddress[];
  savedMeasurements?: {
    bust: string;
    waist: string;
    hips: string;
    shoulder: string;
  };
}
