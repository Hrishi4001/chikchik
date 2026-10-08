'use client';

import type { Order, PaymentMethod, PlaceOrderInput } from '@/lib/types';

export interface GatewayOrderResponse {
  mode: 'razorpay' | 'mock';
  keyId: string | null;
  gatewayOrderId: string;
  amount: number; // paise
}

export interface GatewaySuccess {
  paymentId: string;
  signature?: string;
  method?: PaymentMethod;
}

export class PaymentError extends Error {
  constructor(message: string, public readonly dismissed = false, public readonly paymentId?: string) {
    super(message);
  }
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new PaymentError(data.error || 'Something went wrong. Please try again.');
  return data;
}

/** Server prices the order from its own catalog and, for online payment, opens a gateway order. */
export function placeServerOrder(input: PlaceOrderInput) {
  return post<{ order: Order; gateway?: GatewayOrderResponse }>('/api/orders', input);
}

export function retryOrderPayment(orderId: string) {
  return post<{ order: Order; gateway: GatewayOrderResponse }>(`/api/orders/${orderId}/pay`, {});
}

export async function verifyGatewayPayment(input: {
  orderId: string;
  gatewayOrderId: string;
  paymentId: string;
  signature?: string;
  mockOutcome?: 'success';
  mockMethod?: PaymentMethod;
}): Promise<{ order: Order }> {
  const data = await post<{ verified: boolean; order: Order; error?: string }>('/api/payments/verify', input).catch((err) => {
    throw new PaymentError(err.message || 'Payment verification failed', false, input.paymentId);
  });
  if (!data.verified) throw new PaymentError(data.error || 'Payment verification failed', false, input.paymentId);
  return data;
}

/** Best-effort record of a failed/abandoned attempt for the admin timeline. */
export function reportPaymentFailure(input: { orderId: string; gatewayOrderId: string; paymentId?: string; failureReason: string }) {
  return post('/api/payments/verify', input).catch(() => undefined);
}

// ---- Razorpay Checkout (live mode) ----

interface RazorpayInstance {
  open: () => void;
  on: (event: 'payment.failed', cb: (resp: { error: { description?: string; metadata?: { payment_id?: string } } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null;
        reject(new PaymentError('Could not load Razorpay. Check your connection and retry.'));
      };
      document.body.appendChild(script);
    });
  }
  return scriptPromise;
}

export async function openRazorpayCheckout(opts: {
  keyId: string;
  gatewayOrderId: string;
  amount: number; // paise
  description: string;
  prefill: { name: string; email: string; contact: string };
}): Promise<GatewaySuccess> {
  await loadRazorpayScript();
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: opts.keyId,
      order_id: opts.gatewayOrderId,
      amount: opts.amount,
      currency: 'INR',
      name: 'Heva Elegance',
      description: opts.description,
      prefill: opts.prefill,
      theme: { color: '#580F00' },
      handler: (resp: { razorpay_payment_id: string; razorpay_signature: string }) =>
        resolve({ paymentId: resp.razorpay_payment_id, signature: resp.razorpay_signature }),
      modal: { ondismiss: () => reject(new PaymentError('Payment window closed before completion', true)) }
    });
    rzp.on('payment.failed', (resp) =>
      reject(new PaymentError(resp.error.description || 'Payment failed', false, resp.error.metadata?.payment_id))
    );
    rzp.open();
  });
}
