import crypto from 'node:crypto';

/**
 * Razorpay server helpers.
 *
 * Live mode turns on automatically when RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set.
 * Without them the gateway runs in "mock" mode so the full checkout flow can be exercised locally.
 */

const RAZORPAY_API = 'https://api.razorpay.com/v1';

export type GatewayMode = 'razorpay' | 'mock';

export function getGatewayMode(): GatewayMode {
  return process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? 'razorpay' : 'mock';
}

function authHeader() {
  const token = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
  return `Basic ${token}`;
}

export interface GatewayOrder {
  id: string;
  amount: number; // paise
  currency: 'INR';
  receipt: string;
}

export async function createGatewayOrder(amountInPaise: number, receipt: string, notes: Record<string, string> = {}): Promise<GatewayOrder> {
  if (getGatewayMode() === 'mock') {
    return { id: `order_mock_${crypto.randomBytes(7).toString('hex')}`, amount: amountInPaise, currency: 'INR', receipt };
  }

  const res = await fetch(`${RAZORPAY_API}/orders`, {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountInPaise, currency: 'INR', receipt, notes }),
    cache: 'no-store'
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Razorpay order creation failed (${res.status}): ${body}`);
  }
  return res.json();
}

function safeEqualHex(a: string, b: string) {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/** Verifies the signature Razorpay Checkout returns to the browser after a successful payment. */
export function verifyPaymentSignature(gatewayOrderId: string, paymentId: string, signature: string): boolean {
  const secret = getGatewayMode() === 'mock' ? 'mock_secret' : process.env.RAZORPAY_KEY_SECRET!;
  const expected = crypto.createHmac('sha256', secret).update(`${gatewayOrderId}|${paymentId}`).digest('hex');
  return safeEqualHex(expected, signature);
}

/** Mock-mode only: produce the signature Razorpay would have produced. */
export function signMockPayment(gatewayOrderId: string, paymentId: string): string {
  return crypto.createHmac('sha256', 'mock_secret').update(`${gatewayOrderId}|${paymentId}`).digest('hex');
}

/** Verifies the X-Razorpay-Signature header on webhook deliveries. */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return safeEqualHex(expected, signature);
}

const METHOD_MAP: Record<string, 'UPI' | 'Card' | 'NetBanking' | 'Wallet'> = {
  upi: 'UPI',
  card: 'Card',
  netbanking: 'NetBanking',
  wallet: 'Wallet'
};

/** Looks up the method the customer actually used inside Razorpay Checkout. */
export async function fetchPaymentMethod(paymentId: string) {
  if (getGatewayMode() === 'mock') return undefined;
  const res = await fetch(`${RAZORPAY_API}/payments/${paymentId}`, {
    headers: { Authorization: authHeader() },
    cache: 'no-store'
  });
  if (!res.ok) return undefined;
  const payment = await res.json();
  return METHOD_MAP[payment.method as string];
}
