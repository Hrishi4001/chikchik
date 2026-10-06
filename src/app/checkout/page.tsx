'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  ArrowLeft,
  CreditCard,
  Banknote,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  MapPin,
  Loader2
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Order, PaymentAttempt, UserAddress } from '@/lib/types';
import { CART_MILESTONES, STANDARD_SHIPPING_FEE, getCartRewards } from '@/lib/cartRewards';
import {
  createGatewayOrder,
  openRazorpayCheckout,
  PaymentError,
  verifyGatewayPayment,
  type GatewaySuccess
} from '@/lib/payments/client';
import MockPaymentSheet, { type MockOutcome } from '@/components/checkout/MockPaymentSheet';

type Step = 1 | 2 | 3;
type PayOption = 'online' | 'COD';

const COD_LIMIT = 50000;

const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '2rem',
  borderRadius: '8px',
  border: '1px solid var(--border-subtle)',
  boxShadow: 'var(--shadow-subtle)'
};
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' };
const inputStyle = (invalid?: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '0.7rem',
  fontSize: '0.85rem',
  border: `1px solid ${invalid ? '#c0392b' : 'var(--border-medium, #DDD8CE)'}`,
  borderRadius: '4px',
  outline: 'none'
});
const errorText: React.CSSProperties = { fontSize: '0.72rem', color: '#c0392b', marginTop: '0.3rem' };
const headingStyle: React.CSSProperties = { fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 600 };

function addDays(days: number) {
  return new Date(Date.now() + days * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    promoDiscount,
    milestoneDiscount,
    promoCode,
    formatPrice,
    createOrder,
    updateOrder,
    commitOrderStock,
    clearCart,
    checkPincode,
    hydrated
  } = useStore();

  const [step, setStep] = useState<Step>(1);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const country = 'India';

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [selectedPayOption, setPayOption] = useState<PayOption>('online');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [mockSheet, setMockSheet] = useState<{ orderNumber: string; resolve: (r: MockOutcome) => void } | null>(null);

  // A pending order is reused across payment retries so failed attempts stay on one order record.
  const pendingOrderRef = useRef<{ order: Order; cartKey: string } | null>(null);

  const pinInfo = /^\d{6}$/.test(pincode) ? checkPincode(pincode) : null;
  const hasStitching = cart.some((i) => i.selectedStitching && i.selectedStitching.price > 0);
  const shippingCost = shippingMethod === 'express' ? 800 : getCartRewards(cartSubtotal).freeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const grandTotal = Math.max(0, cartSubtotal - cartDiscount + shippingCost);
  const codAvailable = !!pinInfo?.cod && grandTotal <= COD_LIMIT;
  const payOption: PayOption = codAvailable ? selectedPayOption : 'online';
  const transitDays = (pinInfo?.days ?? 4) + (shippingMethod === 'express' ? 0 : 2) + (hasStitching ? 5 : 0);


  // Autofill city/state from a known pincode
  const handlePincodeChange = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 6);
    setPincode(clean);
    if (clean.length === 6) {
      const info = checkPincode(clean);
      if (info.serviceable && info.city && info.city !== 'India Hub') {
        setCity(info.city);
        setState(info.state || '');
      }
    }
  };

  const validateContact = () => {
    const e: Record<string, string> = {};
    if (contactName.trim().length < 2) e.name = 'Enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) e.email = 'Enter a valid email address';
    if (contactPhone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '').length !== 10) e.phone = 'Enter a 10-digit mobile number';
    return e;
  };

  const validateAddress = () => {
    const e: Record<string, string> = {};
    if (streetAddress.trim().length < 5) e.street = 'Enter your street address';
    if (!city.trim()) e.city = 'Enter your city';
    if (!state.trim()) e.state = 'Enter your state';
    if (!/^\d{6}$/.test(pincode)) e.pincode = 'Enter a 6-digit pincode';
    else if (!pinInfo?.serviceable) e.pincode = 'We do not deliver to this pincode yet';
    return e;
  };

  const goToStep = (target: Step) => {
    const e = target >= 2 ? validateContact() : {};
    if (target === 3) Object.assign(e, validateAddress());
    setErrors(e);
    if (Object.keys(e).length === 0) setStep(target);
    else setStep(e.name || e.email || e.phone ? 1 : 2);
  };

  if (isRedirecting) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Confirming your order…</p>
      </div>
    );
  }

  if (hydrated && cart.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>Your Shopping Bag is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Please select your desired ethnic wear creations before proceeding to checkout.
        </p>
        <Link href="/shop" className="btn-primary">
          Explore Haute Collections
        </Link>
      </div>
    );
  }

  const askMockGateway = (orderNumber: string) =>
    new Promise<GatewaySuccess>((resolve, reject) => {
      setMockSheet({
        orderNumber,
        resolve: (r) => {
          setMockSheet(null);
          if (r.outcome === 'success') resolve({ paymentId: `pay_mock_${Date.now().toString(36)}`, method: r.method });
          else if (r.outcome === 'failure') reject(new PaymentError(r.reason));
          else reject(new PaymentError('Payment window closed before completion', true));
        }
      });
    });

  const getOrCreatePendingOrder = (): Order => {
    const cartKey = JSON.stringify([cart.map((i) => [i.id, i.quantity]), grandTotal]);
    if (pendingOrderRef.current?.cartKey === cartKey) return pendingOrderRef.current.order;

    const shippingAddress: UserAddress = {
      id: `addr-${Date.now()}`,
      fullName: contactName.trim(),
      phone: contactPhone.trim(),
      street: streetAddress.trim(),
      apartment: apartment.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode,
      country
    };

    const order = createOrder({
      customerName: contactName.trim(),
      customerEmail: contactEmail.trim(),
      customerPhone: contactPhone.trim(),
      shippingAddress,
      items: cart.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.title,
        productImage: item.product.images[0],
        category: item.product.categoryLabel,
        size: item.selectedSize,
        stitching: item.selectedStitching?.name,
        quantity: item.quantity,
        price: item.unitPrice
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      promoCode: promoCode || undefined,
      shippingFee: shippingCost,
      shippingMethod,
      total: grandTotal,
      currency: 'INR',
      paymentMethod: payOption === 'COD' ? 'COD' : 'UPI',
      paymentStatus: 'Pending',
      payment: { provider: payOption === 'COD' ? 'cod' : 'razorpay', attempts: [] },
      fulfillmentStatus: 'Processing',
      estimatedDelivery: addDays(transitDays)
    });
    pendingOrderRef.current = { order, cartKey };
    return order;
  };

  const finish = (order: Order) => {
    commitOrderStock(order);
    pendingOrderRef.current = null;
    setIsRedirecting(true);
    clearCart();
    router.push(`/order-success/${order.id}`);
  };

  const handlePlaceOrder = async () => {
    const e = { ...validateContact(), ...validateAddress() };
    setErrors(e);
    if (Object.keys(e).length) {
      setStep(e.name || e.email || e.phone ? 1 : 2);
      return;
    }
    if (payOption === 'COD' && !codAvailable) {
      setPaymentError('Cash on Delivery is not available for this order.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);
    const order = getOrCreatePendingOrder();

    if (payOption === 'COD') {
      updateOrder(
        order.id,
        (o) => ({ paymentMethod: 'COD', paymentStatus: 'Pending', payment: { ...(o.payment || { attempts: [] }), provider: 'cod' } }),
        { label: 'Cash on Delivery order confirmed', note: 'Payment to be collected at delivery' }
      );
      setIsProcessing(false);
      finish(order);
      return;
    }

    const attemptId = `att-${Date.now()}`;
    let gatewayOrderId: string | undefined;
    try {
      const gw = await createGatewayOrder({
        amount: grandTotal,
        receipt: order.orderNumber,
        customer: { name: contactName, email: contactEmail, phone: contactPhone }
      });
      gatewayOrderId = gw.gatewayOrderId;

      const attempt: PaymentAttempt = { id: attemptId, at: new Date().toISOString(), status: 'Created', gatewayOrderId };
      updateOrder(order.id, (o) => ({
        payment: { ...o.payment!, provider: gw.mode, gatewayOrderId, attempts: [...(o.payment?.attempts || []), attempt] }
      }));

      const result =
        gw.mode === 'razorpay' && gw.keyId
          ? await openRazorpayCheckout({
              keyId: gw.keyId,
              gatewayOrderId: gw.gatewayOrderId,
              amount: gw.amount,
              description: `Order ${order.orderNumber}`,
              prefill: { name: contactName, email: contactEmail, contact: contactPhone }
            })
          : await askMockGateway(order.orderNumber);

      const verified = await verifyGatewayPayment({
        gatewayOrderId: gw.gatewayOrderId,
        paymentId: result.paymentId,
        signature: result.signature,
        mockOutcome: gw.mode === 'mock' ? 'success' : undefined
      });
      const method = verified.method || result.method || 'UPI';
      const paidAt = new Date().toISOString();

      updateOrder(
        order.id,
        (o) => ({
          paymentStatus: 'Paid',
          paymentMethod: method,
          payment: {
            ...o.payment!,
            gatewayPaymentId: verified.paymentId,
            paidAt,
            attempts: (o.payment?.attempts || []).map((a) =>
              a.id === attemptId ? { ...a, status: 'Captured', gatewayPaymentId: verified.paymentId, method } : a
            )
          }
        }),
        { label: 'Payment captured', note: `${method} · ${verified.paymentId}` }
      );
      setIsProcessing(false);
      finish(order);
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'Payment could not be completed';
      const dismissed = err instanceof PaymentError && err.dismissed;
      const failedPaymentId = err instanceof PaymentError ? err.paymentId : undefined;
      updateOrder(
        order.id,
        (o) => {
          const attempts = o.payment?.attempts || [];
          const failed: PaymentAttempt = { id: attemptId, at: new Date().toISOString(), status: 'Failed', gatewayOrderId, gatewayPaymentId: failedPaymentId, reason };
          return {
            paymentStatus: 'Failed',
            payment: {
              ...(o.payment || { provider: 'razorpay' }),
              attempts: attempts.some((a) => a.id === attemptId) ? attempts.map((a) => (a.id === attemptId ? { ...a, ...failed } : a)) : [...attempts, failed]
            }
          };
        },
        { label: dismissed ? 'Payment abandoned' : 'Payment failed', note: reason }
      );
      setPaymentError(dismissed ? 'Payment was cancelled. Your bag is saved — you can retry anytime.' : `${reason}. No money was deducted — please retry or choose another method.`);
      setIsProcessing(false);
    }
  };

  const stepHeader = (n: Step, title: string, summary?: React.ReactNode) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
      <div>
        <h3 style={{ ...headingStyle, color: step >= n ? 'var(--text-primary)' : 'var(--text-muted)' }}>
          {n}. {title}
        </h3>
        {step > n && summary && <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>{summary}</div>}
      </div>
      {step > n && (
        <button type="button" onClick={() => setStep(n)} style={{ fontSize: '0.78rem', fontWeight: 600, textDecoration: 'underline' }}>
          Edit
        </button>
      )}
      {step > n && <CheckCircle2 size={18} color="#1f7a4d" style={{ flexShrink: 0 }} />}
    </div>
  );

  const optionStyle = (active: boolean, disabled = false): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    padding: '0.95rem 1rem',
    borderRadius: '6px',
    border: active ? '1.5px solid var(--text-primary)' : '1px solid var(--border-medium, #DDD8CE)',
    backgroundColor: active ? '#FBF9F5' : '#FFFFFF',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1
  });

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh', paddingTop: '2.5rem', paddingBottom: '6rem' }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <Link href="/shop" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <ArrowLeft size={16} />
            <span>Return to Boutique</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#1f7a4d', fontWeight: 600 }}>
            <Lock size={14} />
            <span>Secure checkout · Payments by Razorpay</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 1. Contact */}
            <section style={cardStyle}>
              {stepHeader(1, 'Contact Information', `${contactName} · ${contactEmail} · ${contactPhone}`)}
              {step === 1 && (
                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label htmlFor="co-name" style={labelStyle}>Full Name *</label>
                      <input id="co-name" autoComplete="name" value={contactName} onChange={(e) => setContactName(e.target.value)} style={inputStyle(!!errors.name)} />
                      {errors.name && <p style={errorText}>{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="co-email" style={labelStyle}>Email *</label>
                      <input id="co-email" type="email" autoComplete="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} style={inputStyle(!!errors.email)} />
                      {errors.email && <p style={errorText}>{errors.email}</p>}
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label htmlFor="co-phone" style={labelStyle}>Mobile Number *</label>
                      <input id="co-phone" type="tel" autoComplete="tel" placeholder="+91 98XXX XXXXX" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} style={inputStyle(!!errors.phone)} />
                      {errors.phone && <p style={errorText}>{errors.phone}</p>}
                    </div>
                  </div>
                  <button type="button" className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => goToStep(2)}>
                    Continue to Delivery
                  </button>
                </div>
              )}
            </section>

            {/* 2. Delivery */}
            <section style={cardStyle}>
              {stepHeader(
                2,
                'Delivery',
                <>
                  {streetAddress}
                  {apartment && `, ${apartment}`}, {city}, {state} – {pincode}
                  <br />
                  {shippingMethod === 'express' ? 'Priority delivery' : 'Standard delivery'} · arrives by {addDays(transitDays)}
                </>
              )}
              {step === 2 && (
                <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label htmlFor="co-street" style={labelStyle}>Street Address & Building *</label>
                    <input id="co-street" autoComplete="address-line1" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="House / Flat No., Society / Road" style={inputStyle(!!errors.street)} />
                    {errors.street && <p style={errorText}>{errors.street}</p>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label htmlFor="co-pin" style={labelStyle}>Pincode *</label>
                      <input id="co-pin" inputMode="numeric" autoComplete="postal-code" value={pincode} onChange={(e) => handlePincodeChange(e.target.value)} style={inputStyle(!!errors.pincode)} />
                      {errors.pincode && <p style={errorText}>{errors.pincode}</p>}
                    </div>
                    <div>
                      <label htmlFor="co-apt" style={labelStyle}>Apartment / Landmark</label>
                      <input id="co-apt" autoComplete="address-line2" value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="Optional" style={inputStyle()} />
                    </div>
                    <div>
                      <label htmlFor="co-city" style={labelStyle}>City *</label>
                      <input id="co-city" autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle(!!errors.city)} />
                      {errors.city && <p style={errorText}>{errors.city}</p>}
                    </div>
                    <div>
                      <label htmlFor="co-state" style={labelStyle}>State *</label>
                      <input id="co-state" autoComplete="address-level1" value={state} onChange={(e) => setState(e.target.value)} style={inputStyle(!!errors.state)} />
                      {errors.state && <p style={errorText}>{errors.state}</p>}
                    </div>
                  </div>

                  {pinInfo?.serviceable && (
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#1f7a4d' }}>
                      <MapPin size={14} /> Delivers to {pincode} · {pinInfo.cod ? 'Cash on Delivery available' : 'Prepaid only'}
                    </p>
                  )}

                  <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <p style={{ ...labelStyle, marginBottom: '0.75rem' }}>Delivery Speed</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <label style={optionStyle(shippingMethod === 'standard')}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <input type="radio" name="shippingMethod" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} style={{ accentColor: 'var(--text-primary)' }} />
                          <span>
                            <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Standard Insured Delivery</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Free above {formatPrice(CART_MILESTONES[0].threshold)}</span>
                          </span>
                        </span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{getCartRewards(cartSubtotal).freeShipping ? 'FREE' : formatPrice(STANDARD_SHIPPING_FEE)}</span>
                      </label>
                      <label style={optionStyle(shippingMethod === 'express')}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <input type="radio" name="shippingMethod" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} style={{ accentColor: 'var(--text-primary)' }} />
                          <span>
                            <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Priority Delivery</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dispatched within 24 hours</span>
                          </span>
                        </span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{formatPrice(800)}</span>
                      </label>
                    </div>
                    {hasStitching && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
                        Includes 5 days for made-to-measure tailoring.
                      </p>
                    )}
                  </div>

                  <button type="button" className="btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => goToStep(3)}>
                    Continue to Payment
                  </button>
                </div>
              )}
            </section>

            {/* 3. Payment */}
            <section style={cardStyle}>
              {stepHeader(3, 'Payment')}
              {step === 3 && (
                <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={optionStyle(payOption === 'online')}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <input type="radio" name="payment" checked={payOption === 'online'} onChange={() => setPayOption('online')} style={{ accentColor: 'var(--text-primary)' }} />
                      <span>
                        <span style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem' }}>Pay Online</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UPI, Cards, Netbanking & Wallets via Razorpay</span>
                      </span>
                    </span>
                    <CreditCard size={18} color="var(--text-secondary)" />
                  </label>

                  <label style={optionStyle(payOption === 'COD', !codAvailable)}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <input type="radio" name="payment" disabled={!codAvailable} checked={payOption === 'COD'} onChange={() => setPayOption('COD')} style={{ accentColor: 'var(--text-primary)' }} />
                      <span>
                        <span style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem' }}>Cash on Delivery</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {codAvailable ? 'Pay in cash or UPI when your order arrives' : grandTotal > COD_LIMIT ? `Available on orders up to ${formatPrice(COD_LIMIT)}` : 'Not available for this pincode'}
                        </span>
                      </span>
                    </span>
                    <Banknote size={18} color="var(--text-secondary)" />
                  </label>

                  {paymentError && (
                    <div role="alert" style={{ display: 'flex', gap: '0.6rem', padding: '0.85rem 1rem', borderRadius: '6px', backgroundColor: '#FDF1EF', border: '1px solid #F2C9C2', fontSize: '0.82rem', color: '#8a2a1d' }}>
                      <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{paymentError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1.15rem', fontSize: '0.95rem', marginTop: '0.5rem', opacity: isProcessing ? 0.7 : 1, cursor: isProcessing ? 'wait' : 'pointer' }}
                  >
                    {isProcessing
                      ? 'Processing…'
                      : payOption === 'COD'
                        ? `Place Order · ${formatPrice(grandTotal)}`
                        : `${paymentError ? 'Retry Payment' : 'Pay'} ${formatPrice(grandTotal)}`}
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Order summary */}
          <aside style={{ ...cardStyle, position: 'sticky', top: '100px' }}>
            <h3 style={{ ...headingStyle, marginBottom: '1.25rem' }}>Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '320px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={item.product.images[0]} alt={item.product.title} style={{ width: '54px', height: '72px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.2 }}>{item.product.title}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Size: {item.selectedSize} {item.selectedStitching ? `• ${item.selectedStitching.name}` : ''}
                    </p>
                    <p style={{ fontSize: '0.75rem', fontWeight: 500, marginTop: '0.2rem' }}>
                      Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>Discount ({promoCode})</span>
                  <span>- {formatPrice(promoDiscount)}</span>
                </div>
              )}
              {milestoneDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>Milestone Reward</span>
                  <span>- {formatPrice(milestoneDiscount)}</span>
                </div>
              )}
              {getCartRewards(cartSubtotal).gift && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#1B4435' }}>
                  <span>Exclusive Gift</span>
                  <span>Included</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#FDF9F5', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '0.6rem' }}>
              <Sparkles size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Each garment ships with a cotton dust bag, handloom certification and insured doorstep delivery.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {mockSheet && <MockPaymentSheet amountLabel={`₹${grandTotal.toLocaleString('en-IN')}`} orderNumber={mockSheet.orderNumber} onResult={mockSheet.resolve} />}
    </div>
  );
}
