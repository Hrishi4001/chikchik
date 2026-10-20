'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Package, Truck, MapPin, Printer, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default function OrderSuccessPage({ params }: PageProps) {
  const { orderId } = use(params);
  const { orders, formatPrice, hydrated } = useStore();

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        {hydrated ? (
          <>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>Order not found</h2>
            <Link href="/shop" className="btn-primary">Continue shopping</Link>
          </>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Loading your order…</p>
        )}
      </div>
    );
  }

  const steps = [
    { label: 'Order Confirmed', date: order.date, completed: true },
    { label: 'Quality Check & Packing', date: 'Within 1–3 working days', completed: order.fulfillmentStatus !== 'Processing' },
    { label: 'Dispatched with Tracking', date: 'Tracking sent on WhatsApp/SMS', completed: ['Dispatched', 'Delivered'].includes(order.fulfillmentStatus) },
    { label: 'Delivered', date: `Expected by ${order.estimatedDelivery}`, completed: order.fulfillmentStatus === 'Delivered' }
  ];

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: '840px' }}>
      {/* Thank you presentation header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#FFF4C2',
            color: 'var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}
        >
          <CheckCircle2 size={36} />
        </div>

        <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
          Payment & Order Confirmed
        </span>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', fontWeight: 500, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
          Thank You, {order.customerName.split(' ')[0]}
        </h1>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
          Order reference: <strong>{order.orderNumber}</strong> • Keep this handy — we&apos;ll contact you on {order.customerPhone} with dispatch and tracking details
        </p>
      </div>

      {/* Live Fulfillment Timeline Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          padding: '2rem',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-subtle)',
          marginBottom: '2.5rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600 }}>
              Order Timeline
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Current Status: <strong style={{ color: '#111111' }}>{order.fulfillmentStatus}</strong>
            </p>
          </div>
          {order.trackingNumber && (
            <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px' }}>
              Tracking: <strong>{order.trackingNumber}</strong>
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', position: 'relative' }}>
          {steps.map((st, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: st.completed ? 'var(--accent-emerald)' : 'var(--bg-subtle)',
                  color: st.completed ? '#FFFFFF' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginBottom: '0.6rem'
                }}
              >
                {st.completed ? '✓' : i + 1}
              </div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {st.label}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {st.date}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Shipping Destination */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <MapPin size={16} color="#111111" />
            <h4 style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Insured Delivery Destination
            </h4>
          </div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{order.shippingAddress.fullName}</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
            {order.shippingAddress.street}, {order.shippingAddress.apartment && `${order.shippingAddress.apartment}, `}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
            {order.shippingAddress.country}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Phone: {order.shippingAddress.phone}
          </p>
        </div>

        {/* Payment Summary */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            Payment Summary
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Method</span>
              <span>{order.paymentMethod} ({order.paymentMethod === 'COD' && order.paymentStatus === 'Pending' ? 'Pay on delivery' : order.paymentStatus})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#111111' }}>
                <span>Privilege Discount</span>
                <span>- {formatPrice(order.discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Insured Shipping</span>
              <span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
              <span>Total Paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Purchased Items List */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '2rem', border: '1px solid var(--border-subtle)', marginBottom: '3rem' }}>
        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          Items in this Package ({order.items.length})
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingBottom: '1rem', borderBottom: idx < order.items.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <img
                src={item.productImage}
                alt={item.productTitle}
                style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 600 }}>
                  {item.productTitle}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Size: {item.size} • Qty: {item.quantity}
                </p>
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link href="/shop" className="btn-primary">
          <span>Continue Browsing Boutique</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
