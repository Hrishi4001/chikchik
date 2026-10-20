import crypto from 'node:crypto';
import type { PaymentMethod } from '@/lib/types';

/**
 * Cashfree Payments (PG API 2023-08-01) server helpers.
 *
 * Turns on when CASHFREE_APP_ID and CASHFREE_SECRET_KEY are set. CASHFREE_ENV=production
 * uses live endpoints; anything else uses sandbox.
 */

const API_VERSION = '2023-08-01';
/** One Click Checkout (products.one_click_checkout, cart_details, /extended) needs the newer API. */
const OCC_API_VERSION = '2025-01-01';

export type CashfreeEnv = 'sandbox' | 'production';

export function isCashfreeConfigured() {
  return Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);
}

/** One Click Checkout must also be activated on the Cashfree account before setting this. */
export function isOneClickEnabled() {
  return isCashfreeConfigured() && process.env.CASHFREE_ONE_CLICK === 'true';
}

export function getCashfreeEnv(): CashfreeEnv {
  return process.env.CASHFREE_ENV === 'production' ? 'production' : 'sandbox';
}

function apiBase() {
  return getCashfreeEnv() === 'production' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';
}

function headers(version = API_VERSION) {
  return {
    'x-client-id': process.env.CASHFREE_APP_ID!,
    'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
    'x-api-version': version,
    'Content-Type': 'application/json'
  };
}

export interface CashfreeOrder {
  order_id: string;
  cf_order_id: string;
  order_amount: number;
  order_status: 'ACTIVE' | 'PAID' | 'EXPIRED' | 'TERMINATED' | 'TERMINATION_REQUESTED';
  payment_session_id: string;
}

export async function createCashfreeOrder(input: {
  orderId: string; // our gateway order id: alphanumeric, '_' or '-', max 45 chars
  amount: number; // rupees
  customer: { id: string; name: string; email: string; phone: string };
  returnUrl?: string;
  notifyUrl?: string;
  note?: string;
  /** Hand address collection, OTP login and payment to Cashfree One Click Checkout. */
  oneClick?: { cartItems: CashfreeCartItem[] };
}): Promise<CashfreeOrder> {
  const res = await fetch(`${apiBase()}/orders`, {
    method: 'POST',
    headers: headers(input.oneClick ? OCC_API_VERSION : API_VERSION),
    body: JSON.stringify({
      order_id: input.orderId,
      order_amount: input.amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: input.customer.id,
        customer_name: input.customer.name,
        customer_email: input.customer.email,
        customer_phone: input.customer.phone.replace(/\D/g, '').slice(-10)
      },
      order_meta: {
        ...(input.returnUrl && { return_url: input.returnUrl }),
        ...(input.notifyUrl && { notify_url: input.notifyUrl })
      },
      order_note: input.note,
      ...(input.oneClick && {
        products: {
          one_click_checkout: {
            enabled: true,
            conditions: [{ action: 'ALLOW', key: 'features', values: ['checkoutCollectAddress', 'checkoutAuthenticate'] }]
          }
        },
        cart_details: { cart_items: input.oneClick.cartItems }
      })
    }),
    cache: 'no-store'
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cashfree order creation failed (${res.status}): ${body}`);
  }
  return res.json();
}

export interface CashfreeCartItem {
  item_id: string;
  item_name: string;
  item_description?: string;
  item_details_url?: string;
  item_image_url?: string;
  item_original_unit_price: number;
  item_discounted_unit_price: number;
  item_quantity: number;
  item_currency: 'INR';
}

export interface CashfreeAddress {
  name?: string;
  address_line_one?: string;
  address_line_two?: string;
  state?: string;
  city?: string;
  pin_code?: string;
  phone?: string;
  email?: string;
}

export interface CashfreeOrderExtended {
  order_id: string;
  order_amount: number;
  charges?: { shipping_charges?: number; cod_handling_charges?: number };
  customer_details?: { customer_name?: string; customer_email?: string; customer_phone?: string };
  shipping_address?: CashfreeAddress;
  billing_address?: CashfreeAddress;
}

/** Address, customer and charges captured by One Click Checkout. */
export async function fetchCashfreeOrderExtended(gatewayOrderId: string): Promise<CashfreeOrderExtended> {
  const res = await fetch(`${apiBase()}/orders/${encodeURIComponent(gatewayOrderId)}/extended`, { headers: headers(OCC_API_VERSION), cache: 'no-store' });
  if (!res.ok) throw new Error(`Cashfree extended order lookup failed (${res.status})`);
  return res.json();
}

export interface CashfreePayment {
  cf_payment_id: string | number;
  payment_status: 'SUCCESS' | 'NOT_ATTEMPTED' | 'FAILED' | 'USER_DROPPED' | 'VOID' | 'CANCELLED' | 'PENDING';
  payment_group?: string;
  payment_message?: string;
  payment_amount?: number;
}

export async function fetchCashfreePayments(gatewayOrderId: string): Promise<CashfreePayment[]> {
  const res = await fetch(`${apiBase()}/orders/${encodeURIComponent(gatewayOrderId)}/payments`, { headers: headers(), cache: 'no-store' });
  if (!res.ok) throw new Error(`Cashfree payment lookup failed (${res.status})`);
  return res.json();
}

/** Server-side source of truth for a Cashfree order: never trust the browser's word that it paid. */
export async function getCashfreeOutcome(gatewayOrderId: string): Promise<
  | { status: 'paid'; paymentId: string; method: PaymentMethod }
  | { status: 'failed'; paymentId?: string; reason: string }
  | { status: 'pending' }
> {
  const payments = await fetchCashfreePayments(gatewayOrderId);
  const success = payments.find((p) => p.payment_status === 'SUCCESS');
  if (success) return { status: 'paid', paymentId: String(success.cf_payment_id), method: mapPaymentGroup(success.payment_group) };
  if (payments.some((p) => p.payment_status === 'PENDING') || payments.length === 0) return { status: 'pending' };
  const last = payments[0];
  return { status: 'failed', paymentId: String(last.cf_payment_id), reason: last.payment_message || 'Payment failed' };
}

export function mapPaymentGroup(group?: string): PaymentMethod {
  if (!group) return 'UPI';
  if (group === 'upi') return 'UPI';
  if (group === 'net_banking') return 'NetBanking';
  if (group === 'wallet') return 'Wallet';
  if (group.includes('card') || group.includes('emi')) return 'Card';
  return 'UPI';
}

/** Verifies x-webhook-signature: base64(HMAC-SHA256(timestamp + rawBody, secret key)). */
export function verifyCashfreeWebhook(rawBody: string, timestamp: string, signature: string): boolean {
  const secret = process.env.CASHFREE_SECRET_KEY;
  if (!secret || !timestamp || !signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(timestamp + rawBody).digest('base64');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
