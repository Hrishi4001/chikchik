'use client';

import type { PaymentMethod } from '@/lib/types';

export interface GatewayOrderResponse {
  mode: 'razorpay' | 'mock';
  keyId: string | null;
  gatewayOrderId: string;
  amount: number; // paise
  currency: 'INR';
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

export async function createGatewayOrder(input: {
  amount: number;
  receipt: string;
  customer: { name: string; email: string; phone: string };
}): Promise<GatewayOrderResponse> {
  const res = await fetch('/api/payments/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new PaymentError(data.error || 'Could not start payment');
  return data;
}

export async function verifyGatewayPayment(input: {
  gatewayOrderId: string;
  paymentId: string;
  signature?: string;
  mockOutcome?: 'success';
}): Promise<{ paymentId: string; method?: PaymentMethod }> {
  const res = await fetch('/api/payments/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.verified) throw new PaymentError(data.error || 'Payment verification failed', false, input.paymentId);
  return data;
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
