'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Zap } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { openCashfreeCheckout, PaymentError, placeOneClickOrder, reportPaymentFailure, verifyGatewayPayment } from '@/lib/payments/client';

let oneClickConfig: Promise<boolean> | null = null;
const loadOneClick = () =>
  (oneClickConfig ??= fetch('/api/payments/config')
    .then((r) => r.json())
    .then((c: { oneClick?: boolean }) => Boolean(c.oneClick))
    .catch(() => false));

/** Cashfree One Click Checkout: mobile number here, then OTP login, saved address and payment inside Cashfree. */
/** `fallback` renders instead when One Click Checkout is switched off, so the store always has a checkout. */
export default function ExpressCheckout({ disabled, fallback }: { disabled?: boolean; fallback?: React.ReactNode }) {
  const router = useRouter();
  const { cart, promoCode, clearCart, recordOrder, commitOrderStock, setIsCartOpen } = useStore();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    loadOneClick().then((on) => live && setEnabled(on));
    return () => {
      live = false;
    };
  }, []);

  if (enabled === false) return <>{fallback}</>;

  const start = async () => {
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Enter your 10-digit mobile number');
      return;
    }
    setBusy(true);
    setError(null);

    let started: Awaited<ReturnType<typeof placeOneClickOrder>>;
    try {
      started = await placeOneClickOrder({
        phone,
        promoCode: promoCode || undefined,
        items: cart.map((item) => ({ productId: item.product.id, size: String(item.selectedSize), quantity: item.quantity }))
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Express checkout is unavailable');
      setBusy(false);
      return;
    }

    const { order, gateway } = started;
    try {
      await openCashfreeCheckout({ paymentSessionId: gateway.paymentSessionId!, env: gateway.cashfreeEnv ?? 'sandbox' });
      const verified = await verifyGatewayPayment({ orderId: order.id, gatewayOrderId: gateway.gatewayOrderId });
      recordOrder(verified.order);
      commitOrderStock(verified.order);
      clearCart();
      setIsCartOpen(false);
      router.push(`/order-success/${verified.order.id}`);
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'Payment could not be completed';
      const dismissed = err instanceof PaymentError && err.dismissed;
      reportPaymentFailure({ orderId: order.id, gatewayOrderId: gateway.gatewayOrderId, failureReason: dismissed ? 'Payment window closed' : reason });
      setError(dismissed ? 'Express checkout was closed. Your bag is saved.' : reason);
      setBusy(false);
    }
  };

  return (
    <div>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="Mobile number"
        aria-label="Mobile number for checkout"
        value={phone}
        maxLength={14}
        onChange={(e) => setPhone(e.target.value.replace(/[^\d+ ]/g, ''))}
        onKeyDown={(e) => e.key === 'Enter' && !busy && !disabled && start()}
        style={{ width: '100%', padding: '0.85rem', marginBottom: '0.6rem', border: '1px solid var(--border-color, #d9d3c9)', fontSize: '0.9rem', background: '#fff' }}
      />
      <button
        type="button"
        onClick={start}
        disabled={busy || disabled || enabled === null}
        className="btn-primary"
        style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: busy || disabled ? 0.6 : 1, cursor: busy || disabled ? 'not-allowed' : 'pointer' }}
      >
        {busy ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={16} />}
        <span>{busy ? 'Opening secure checkout…' : 'Checkout'}</span>
      </button>
      <p style={{ fontSize: '0.7rem', color: error ? '#B3261E' : 'var(--text-muted)', marginTop: '0.45rem', textAlign: 'center' }}>
        {error || 'OTP login, saved addresses & 1-tap pay — powered by Cashfree'}
      </p>
    </div>
  );
}
