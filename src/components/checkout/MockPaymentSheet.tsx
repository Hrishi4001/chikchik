'use client';

import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import type { PaymentMethod } from '@/lib/types';

export type MockOutcome = { outcome: 'success'; method: PaymentMethod } | { outcome: 'failure'; reason: string } | { outcome: 'dismissed' };

interface Props {
  amountLabel: string;
  orderNumber: string;
  onResult: (result: MockOutcome) => void;
}

const METHODS: { id: PaymentMethod; label: string }[] = [
  { id: 'UPI', label: 'UPI' },
  { id: 'Card', label: 'Card' },
  { id: 'NetBanking', label: 'Netbanking' },
  { id: 'Wallet', label: 'Wallet' }
];

/**
 * Stand-in for Razorpay Checkout while RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not configured.
 * Lets you drive both the success and failure paths of the checkout flow.
 */
export default function MockPaymentSheet({ amountLabel, orderNumber, onResult }: Props) {
  const [method, setMethod] = useState<PaymentMethod>('UPI');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Test payment"
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(20,16,10,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
    >
      <div style={{ width: '100%', maxWidth: '380px', backgroundColor: '#FFFFFF', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.25)' }}>
        <div style={{ backgroundColor: '#580F00', color: '#FFFFFF', padding: '1.1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 }}>Test mode · Razorpay not configured</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '0.2rem' }}>{amountLabel}</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>{orderNumber}</p>
          </div>
          <button type="button" aria-label="Close" onClick={() => onResult({ outcome: 'dismissed' })} style={{ color: '#FFFFFF' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.6rem' }}>Pay using</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                aria-pressed={method === m.id}
                style={{
                  padding: '0.7rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: method === m.id ? '1.5px solid #580F00' : '1px solid #DDD8CE',
                  backgroundColor: method === m.id ? '#F7F5EF' : '#FFFFFF'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%', marginBottom: '0.5rem' }}
            onClick={() => onResult({ outcome: 'success', method })}
          >
            Simulate successful payment
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{ width: '100%' }}
            onClick={() => onResult({ outcome: 'failure', reason: 'Payment declined by bank (simulated)' })}
          >
            Simulate failed payment
          </button>

          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#8E8880', marginTop: '1rem' }}>
            <ShieldCheck size={14} /> Set Razorpay keys in .env.local to use the live gateway.
          </p>
        </div>
      </div>
    </div>
  );
}
