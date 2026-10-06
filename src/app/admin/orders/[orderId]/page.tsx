'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Printer, Mail, Phone } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Badge, PageHeader } from '@/components/admin/ui';
import { formatDateTime, FULFILLMENT_FLOW, fulfillmentTone, inr, paymentLabel, paymentTone } from '@/lib/admin';
import type { FulfillmentStatus } from '@/lib/types';
import styles from '../../admin.module.css';

export default function AdminOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, updateOrder, updateOrderStatus, showToast } = useStore();
  const order = orders.find((o) => o.id === orderId);

  const [courier, setCourier] = useState(order?.courier || '');
  const [tracking, setTracking] = useState(order?.trackingNumber || '');
  const [note, setNote] = useState('');
  const [confirming, setConfirming] = useState<'cancel' | 'refund' | null>(null);

  if (!order) {
    return (
      <div className={styles.empty}>
        Order not found. <Link href="/admin/orders">Back to orders</Link>
      </div>
    );
  }

  const isCancelled = order.fulfillmentStatus === 'Cancelled';
  const flowIndex = FULFILLMENT_FLOW.indexOf(order.fulfillmentStatus);
  const next = !isCancelled && flowIndex < FULFILLMENT_FLOW.length - 1 ? FULFILLMENT_FLOW[flowIndex + 1] : null;
  const canFulfil = order.paymentStatus === 'Paid' || (order.paymentMethod === 'COD' && order.paymentStatus === 'Pending');
  const attempts = order.payment?.attempts || [];

  const advance = (status: FulfillmentStatus) => {
    if (status === 'Dispatched' && !order.trackingNumber && !tracking.trim()) {
      showToast('Add a tracking number before marking as dispatched', 'error');
      return;
    }
    if (status === 'Dispatched' && tracking.trim() && tracking.trim() !== order.trackingNumber) {
      updateOrder(order.id, { courier: courier.trim() || undefined, trackingNumber: tracking.trim() });
    }
    updateOrderStatus(order.id, status);
  };

  const saveShipping = () => {
    updateOrder(
      order.id,
      { courier: courier.trim() || undefined, trackingNumber: tracking.trim() || undefined },
      { label: 'Shipping details updated', note: [courier.trim(), tracking.trim()].filter(Boolean).join(' · ') }
    );
    showToast('Shipping details saved', 'success');
  };

  const markCodCollected = () => {
    updateOrder(
      order.id,
      (o) => ({ paymentStatus: 'Paid', payment: { ...(o.payment || { provider: 'cod', attempts: [] }), paidAt: new Date().toISOString() } }),
      { label: 'COD payment collected', note: inr(order.total) }
    );
    showToast('Payment marked as collected', 'success');
  };

  // TODO: when Razorpay is live, call a server route that hits POST /v1/payments/:id/refund before updating state.
  const refund = () => {
    updateOrder(
      order.id,
      (o) => ({
        paymentStatus: 'Refunded',
        fulfillmentStatus: o.fulfillmentStatus === 'Delivered' ? o.fulfillmentStatus : 'Cancelled',
        payment: { ...(o.payment || { provider: 'cod', attempts: [] }), refundedAt: new Date().toISOString(), refundAmount: o.total }
      }),
      { label: 'Refund issued', note: inr(order.total) }
    );
    setConfirming(null);
    showToast('Order refunded', 'info');
  };

  const cancel = () => {
    updateOrderStatus(order.id, 'Cancelled', order.paymentStatus === 'Paid' ? 'Payment still captured — issue a refund' : undefined);
    setConfirming(null);
  };

  const addNote = () => {
    if (!note.trim()) return;
    updateOrder(order.id, {}, { label: 'Note', note: note.trim() });
    setNote('');
  };

  const addr = order.shippingAddress;

  return (
    <>
      <Link href="/admin/orders" className={styles.muted} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
        <ArrowLeft size={14} /> Orders
      </Link>
      <PageHeader
        title={order.orderNumber}
        subtitle={`Placed ${formatDateTime(order.createdAt)}${order.isSample ? ' · sample data' : ''}`}
        actions={
          <>
            <Badge tone={paymentTone(order.paymentStatus)}>{paymentLabel(order)}</Badge>
            <Badge tone={fulfillmentTone(order.fulfillmentStatus)}>{order.fulfillmentStatus}</Badge>
            <button className={styles.btn} onClick={() => window.print()}>
              <Printer size={15} /> Print
            </button>
          </>
        }
      />

      <div className={styles.twoCol}>
        <div className={styles.grid} style={{ alignContent: 'start' }}>
          {/* Fulfilment */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Fulfilment</h2>
              {next && (
                <button className={styles.btnPrimary} onClick={() => advance(next)} disabled={!canFulfil}>
                  Mark as {next}
                </button>
              )}
            </div>
            {isCancelled ? (
              <p className={styles.muted}>This order was cancelled.</p>
            ) : (
              <div className={styles.stepper}>
                {FULFILLMENT_FLOW.map((s, i) => (
                  <div key={s} className={`${styles.step} ${i <= flowIndex ? styles.stepDone : ''}`}>
                    {s}
                  </div>
                ))}
              </div>
            )}
            {!canFulfil && !isCancelled && <p className={styles.fieldError}>Payment not received — fulfilment is blocked until the customer pays.</p>}

            <div className={styles.formGrid} style={{ marginTop: '1rem' }}>
              <div className={styles.field}>
                <label htmlFor="courier">Courier</label>
                <input id="courier" className={styles.input} value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="e.g. Blue Dart" />
              </div>
              <div className={styles.field}>
                <label htmlFor="awb">Tracking / AWB number</label>
                <input id="awb" className={styles.input} value={tracking} onChange={(e) => setTracking(e.target.value)} />
              </div>
            </div>
            <div className={styles.actions} style={{ marginTop: '0.75rem' }}>
              <button className={styles.btn} onClick={saveShipping}>
                Save shipping details
              </button>
              <select
                className={styles.select}
                value=""
                onChange={(e) => e.target.value && updateOrderStatus(order.id, e.target.value as FulfillmentStatus)}
                aria-label="Set status"
              >
                <option value="">Set status…</option>
                {FULFILLMENT_FLOW.filter((s) => s !== order.fulfillmentStatus).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {!isCancelled && order.fulfillmentStatus !== 'Delivered' &&
                (confirming === 'cancel' ? (
                  <>
                    <button className={styles.btnDanger} onClick={cancel}>
                      Confirm cancel
                    </button>
                    <button className={styles.btn} onClick={() => setConfirming(null)}>
                      Keep order
                    </button>
                  </>
                ) : (
                  <button className={styles.btnDanger} onClick={() => setConfirming('cancel')}>
                    Cancel order
                  </button>
                ))}
            </div>
          </section>

          {/* Items */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Items</h2>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <tbody>
                  {order.items.map((i, idx) => (
                    <tr key={idx}>
                      <td style={{ width: 56 }}>
                        <img src={i.productImage} alt="" className={styles.thumb} />
                      </td>
                      <td>
                        <Link href={`/admin/products/${i.productId}`}>
                          <strong>{i.productTitle}</strong>
                        </Link>
                        <div className={styles.muted}>
                          Size {i.size}
                          {i.stitching && ` · ${i.stitching}`}
                        </div>
                      </td>
                      <td className={styles.num}>
                        {i.quantity} × {inr(i.price)}
                      </td>
                      <td className={styles.num}>
                        <strong>{inr(i.quantity * i.price)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <dl className={styles.dl} style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--a-border)' }}>
              <dt>Subtotal</dt>
              <dd>{inr(order.subtotal)}</dd>
              {order.discount > 0 && (
                <>
                  <dt>Discount {order.promoCode && `(${order.promoCode})`}</dt>
                  <dd>− {inr(order.discount)}</dd>
                </>
              )}
              <dt>Shipping {order.shippingMethod === 'express' && '(priority)'}</dt>
              <dd>{order.shippingFee ? inr(order.shippingFee) : 'Free'}</dd>
              <dt>
                <strong style={{ color: 'var(--a-ink)' }}>Total</strong>
              </dt>
              <dd>
                <strong>{inr(order.total)}</strong>
              </dd>
            </dl>
          </section>

          {/* Timeline */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Timeline</h2>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input className={styles.input} placeholder="Add an internal note" value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addNote()} />
              <button className={styles.btn} onClick={addNote} disabled={!note.trim()}>
                Add
              </button>
            </div>
            <ol className={styles.timeline}>
              {[...(order.history || [])].reverse().map((h, i) => (
                <li key={i}>
                  <strong>{h.label}</strong>
                  {h.note && <div>{h.note}</div>}
                  <div className={styles.muted}>{formatDateTime(h.at)}</div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className={styles.grid} style={{ alignContent: 'start' }}>
          {/* Customer */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Customer</h2>
            </div>
            <p style={{ fontWeight: 600 }}>{order.customerName}</p>
            <p className={styles.muted} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
              <Mail size={13} /> <a href={`mailto:${order.customerEmail}`}>{order.customerEmail}</a>
            </p>
            <p className={styles.muted} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
              <Phone size={13} /> <a href={`tel:${order.customerPhone.replace(/\s/g, '')}`}>{order.customerPhone}</a>
            </p>
            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--a-muted)', margin: '1.1rem 0 0.4rem' }}>Ship to</h3>
            <p style={{ fontSize: '0.84rem', lineHeight: 1.5 }}>
              {addr.fullName}
              <br />
              {addr.street}
              {addr.apartment && `, ${addr.apartment}`}
              <br />
              {addr.city}, {addr.state} {addr.pincode}
              <br />
              {addr.country}
            </p>
            <p className={styles.muted} style={{ marginTop: '0.5rem' }}>
              Estimated delivery {order.estimatedDelivery}
            </p>
          </section>

          {/* Payment */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Payment</h2>
              <Badge tone={paymentTone(order.paymentStatus)}>{paymentLabel(order)}</Badge>
            </div>
            <dl className={styles.dl}>
              <dt>Method</dt>
              <dd>{order.paymentMethod}</dd>
              <dt>Gateway</dt>
              <dd>{order.payment?.provider === 'cod' ? 'Cash on delivery' : order.payment?.provider === 'mock' ? 'Razorpay (test mode)' : 'Razorpay'}</dd>
              {order.payment?.gatewayOrderId && (
                <>
                  <dt>Gateway order</dt>
                  <dd className={styles.mono}>{order.payment.gatewayOrderId}</dd>
                </>
              )}
              {order.payment?.gatewayPaymentId && (
                <>
                  <dt>Payment ID</dt>
                  <dd className={styles.mono}>{order.payment.gatewayPaymentId}</dd>
                </>
              )}
              <dt>Paid at</dt>
              <dd>{formatDateTime(order.payment?.paidAt)}</dd>
              {order.payment?.refundedAt && (
                <>
                  <dt>Refunded</dt>
                  <dd>
                    {inr(order.payment.refundAmount || 0)} · {formatDateTime(order.payment.refundedAt)}
                  </dd>
                </>
              )}
            </dl>

            <div className={styles.actions} style={{ marginTop: '1rem' }}>
              {order.paymentMethod === 'COD' && order.paymentStatus === 'Pending' && !isCancelled && (
                <button className={styles.btnPrimary} onClick={markCodCollected}>
                  Mark cash collected
                </button>
              )}
              {order.paymentStatus === 'Paid' &&
                (confirming === 'refund' ? (
                  <>
                    <button className={styles.btnDanger} onClick={refund}>
                      Confirm refund {inr(order.total)}
                    </button>
                    <button className={styles.btn} onClick={() => setConfirming(null)}>
                      Back
                    </button>
                  </>
                ) : (
                  <button className={styles.btnDanger} onClick={() => setConfirming('refund')}>
                    Refund
                  </button>
                ))}
            </div>

            {attempts.length > 0 && (
              <>
                <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--a-muted)', margin: '1.25rem 0 0.5rem' }}>Attempts</h3>
                <ol className={styles.timeline}>
                  {attempts.map((a) => (
                    <li key={a.id}>
                      <Badge tone={a.status === 'Captured' ? 'good' : a.status === 'Failed' ? 'critical' : 'neutral'}>{a.status}</Badge>{' '}
                      {a.method && <span>{a.method}</span>}
                      {a.reason && <div>{a.reason}</div>}
                      <div className={styles.muted}>{formatDateTime(a.at)}</div>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
