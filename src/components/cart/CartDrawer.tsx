'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Trash2, ArrowRight, ShieldCheck, Sparkles, Plus, Minus, Tag, Truck, BadgePercent, Check } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ExpressCheckout from '@/components/checkout/ExpressCheckout';
import { CART_MILESTONES, STANDARD_SHIPPING_FEE, getCartRewards } from '@/lib/cartRewards';

const MILESTONE_ICONS = [Truck, BadgePercent];

export default function CartDrawer() {
  const router = useRouter();
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    cartDiscount, 
    promoDiscount,
    milestoneDiscount,
    promoCode, 
    products,
    addToCart,
    applyPromoCode,
    removePromoCode,
    unavailableItems,
    formatPrice 
  } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [promoError, setPromoError] = useState(false);

  if (!isCartOpen) return null;

  const rewards = getCartRewards(cartSubtotal);
  // Milestones are evenly spaced on the bar; fill interpolates within each segment.
  const segment = 100 / CART_MILESTONES.length;
  const progress = CART_MILESTONES.reduce((acc, m, idx) => {
    const prev = idx === 0 ? 0 : CART_MILESTONES[idx - 1].threshold;
    const ratio = Math.min(1, Math.max(0, (cartSubtotal - prev) / (m.threshold - prev)));
    return acc + ratio * segment;
  }, 0);
  const shippingFee = rewards.freeShipping ? 0 : STANDARD_SHIPPING_FEE;

  const finalTotal = Math.max(0, cartSubtotal - cartDiscount + shippingFee);

  // Cross-sell: in-stock items not in the bag, same categories first, then bestsellers;
  // prefer pieces that close the gap to the next milestone.
  const cartProductIds = new Set(cart.map((i) => i.product.id));
  const bagSizes = new Set(cart.map((i) => i.selectedSize));
  const cartCategories = new Set(cart.map((i) => i.product.category));
  const recommendations = products
    .filter((p) => p.inStock && p.stockCount > 0 && !cartProductIds.has(p.id))
    .map((p) => ({
      p,
      score:
        (cartCategories.has(p.category) ? 0 : 2) +
        (p.isBestseller ? 0 : 1) +
        (rewards.next && p.price >= rewards.remainingForNext ? 0 : 1)
    }))
    .sort((a, b) => a.score - b.score || a.p.price - b.p.price)
    .slice(0, 6)
    .map((r) => r.p);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const ok = applyPromoCode(inputCode);
    if (!ok) {
      setPromoError(true);
      setTimeout(() => setPromoError(false), 3000);
    } else {
      setInputCode('');
    }
  };

  const proceedToCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsCartOpen(false)}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--shadow-drawer)',
          zIndex: 1100,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s var(--ease-luxury) forwards'
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAF8F5'
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}
            >
              Your Shopping Bag
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {cart.length === 0 ? 'Bag is empty' : `${cart.reduce((s, i) => s + i.quantity, 0)} ${cart.reduce((s, i) => s + i.quantity, 0) === 1 ? 'item' : 'items'}`}
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Shopping Bag"
            style={{
              padding: '0.5rem',
              color: 'var(--text-primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Milestone Rewards Bar */}
        <div
          style={{
            padding: '0.9rem 1.75rem 1.1rem',
            backgroundColor: rewards.next ? '#F9F6F0' : '#FFF4C2',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <Sparkles size={14} color="#111111" />
            <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-primary)' }}>
              {rewards.next ? (
                <>
                  Add <strong>{formatPrice(rewards.remainingForNext)}</strong> more to unlock <strong>{rewards.next.perk}</strong>
                </>
              ) : (
                <>All rewards unlocked! <strong>₹100 off &amp; free shipping</strong></>
              )}
            </span>
          </div>
          <div style={{ position: 'relative', height: '4px', margin: '0 36px 2.1rem', backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: '2px' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                borderRadius: '2px',
                backgroundColor: rewards.next ? '#111111' : 'var(--color-accent)',
                transition: 'width 0.4s ease'
              }}
            />
            {CART_MILESTONES.map((m, idx) => {
              const reached = cartSubtotal >= m.threshold;
              const Icon = reached ? Check : MILESTONE_ICONS[idx];
              return (
                <div
                  key={m.threshold}
                  style={{
                    position: 'absolute',
                    left: `${(idx + 1) * segment}%`,
                    top: '50%',
                    transform: 'translate(-50%, -12px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '72px'
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: reached ? 'var(--color-accent)' : '#FFFFFF',
                      border: `1px solid ${reached ? '#111111' : 'var(--border-medium)'}`,
                      color: reached ? '#111111' : 'var(--text-muted)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Icon size={12} />
                  </span>
                  <span style={{ fontSize: '0.62rem', marginTop: '0.25rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {m.label}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{formatPrice(m.threshold)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          {cart.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '3rem 1rem'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <Sparkles size={24} color="var(--accent-gold)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                Your bag is as empty as a summer-vacation diary
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '280px' }}>
                Add a little 90s spark: jet-flame and flip-top lighters with vintage matchbox art.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/shop');
                }}
                className="btn-primary"
              >
                Explore Collections
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                {/* Thumbnail */}
                <Link
                  href={`/product/${item.product.slug}`}
                  onClick={() => setIsCartOpen(false)}
                  style={{
                    width: '84px',
                    height: '112px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: 'var(--bg-subtle)'
                  }}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Link>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={() => setIsCartOpen(false)}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        lineHeight: 1.2
                      }}
                    >
                      {item.product.title}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                      style={{
                        color: 'var(--text-muted)',
                        padding: '0.2rem',
                        transition: 'color 0.2s ease'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {item.product.color && <>Design: <strong>{item.product.color}</strong> · </>}<strong>{item.selectedSize}</strong>
                  </p>

                  {unavailableItems.includes(item) && (
                    <p style={{ fontSize: '0.75rem', color: '#B3261E', fontWeight: 600, marginTop: '0.35rem' }}>
                      Sold out · remove to continue
                    </p>
                  )}

                  {item.selectedStitching && item.selectedStitching.price > 0 && (
                    <p style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', marginTop: '0.15rem' }}>
                      + {item.selectedStitching.name} ({formatPrice(item.selectedStitching.price)})
                    </p>
                  )}

                  {/* Price & Quantity Controls */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                      paddingTop: '0.75rem'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '4px'
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ padding: '0.25rem 0.5rem', color: 'var(--text-primary)' }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.8rem', padding: '0 0.4rem', fontWeight: 600 }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ padding: '0.25rem 0.5rem', color: 'var(--text-primary)' }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span style={{ fontWeight: 600, fontSize: '0.95rem', textDecoration: unavailableItems.includes(item) ? 'line-through' : undefined, color: unavailableItems.includes(item) ? 'var(--text-muted)' : undefined }}>
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {cart.length > 0 && recommendations.length > 0 && (
            <div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                Add to Your Collection
              </p>
              {rewards.next && (
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Add one of these to unlock {rewards.next.perk.toLowerCase()}
                </p>
              )}
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', marginTop: rewards.next ? 0 : '0.6rem' }}>
                {recommendations.map((p) => (
                  <div key={p.id} style={{ width: '128px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={() => setIsCartOpen(false)}
                      style={{ display: 'block', height: '160px', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'var(--bg-subtle)' }}
                    >
                      <img src={p.images[0]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Link>
                    <p style={{ fontSize: '0.75rem', fontWeight: 500, marginTop: '0.4rem', lineHeight: 1.25, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {p.title}
                    </p>
                    <p style={{ fontSize: '0.78rem', fontWeight: 600, marginTop: '0.2rem' }}>
                      {formatPrice(p.price)}
                      {p.compareAtPrice && p.compareAtPrice > p.price && (
                        <span style={{ marginLeft: '0.3rem', fontSize: '0.68rem', fontWeight: 400, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          {formatPrice(p.compareAtPrice)}
                        </span>
                      )}
                    </p>
                    {(() => {
                      // Only quick-add a size the shopper has already chosen elsewhere in the bag; otherwise let them pick
                      const size = p.sizes.length <= 1 ? p.sizes[0] || 'Free Size' : p.sizes.find((s) => bagSizes.has(s));
                      const style = { marginTop: 'auto', padding: '0.4rem', fontSize: '0.68rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' };
                      return size ? (
                        <button onClick={() => addToCart(p, size)} className="btn-secondary" style={style}>
                          <Plus size={12} /> Add {p.sizes.length > 1 ? `(${size})` : ''}
                        </button>
                      ) : (
                        <Link href={`/product/${p.slug}`} onClick={() => setIsCartOpen(false)} className="btn-secondary" style={style}>
                          Choose size
                        </Link>
                      );
                    })()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer with Checkout */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.75rem',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: '#FAF8F5'
            }}
          >
            {/* Promo Code Form */}
            {promoCode ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '1rem', padding: '0.6rem 0.75rem', border: '1px dashed #111111', borderRadius: '4px', backgroundColor: '#FFF4C2', fontSize: '0.8rem', color: '#111111' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Tag size={14} /> <strong>{promoCode}</strong> applied · you save {formatPrice(promoDiscount)}
                </span>
                <button type="button" onClick={removePromoCode} style={{ fontSize: '0.75rem', textDecoration: 'underline', color: 'var(--text-secondary)' }}>
                  Remove
                </button>
              </div>
            ) : (
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Tag size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Promo code"
                  aria-label="Promo code"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2rem',
                    fontSize: '0.8rem',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    outline: 'none'
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn-secondary"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem' }}
              >
                Apply
              </button>
            </form>
            )}

            {promoError && (
              <p style={{ fontSize: '0.72rem', color: 'red', marginTop: '-0.5rem', marginBottom: '0.75rem' }}>
                That code isn&apos;t valid. New here? Try FIRST15 for 15% off.
              </p>
            )}

            {/* Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--color-earth-brown)' }}>
                  <span>Discount ({promoCode})</span>
                  <span>- {formatPrice(promoDiscount)}</span>
                </div>
              )}
              {milestoneDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--color-earth-brown)' }}>
                  <span>Milestone Reward</span>
                  <span>- {formatPrice(milestoneDiscount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span>Estimated Shipping</span>
                <span>{rewards.freeShipping ? 'FREE (Insured)' : formatPrice(STANDARD_SHIPPING_FEE)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  marginTop: '0.5rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                <span>Total Due</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            {unavailableItems.length > 0 && (
              <p style={{ fontSize: '0.75rem', color: '#B3261E', marginBottom: '0.6rem', textAlign: 'center' }}>
                Remove sold-out {unavailableItems.length === 1 ? 'item' : 'items'} to check out.
              </p>
            )}
            <ExpressCheckout
              disabled={unavailableItems.length > 0}
              fallback={
                <button
                  onClick={proceedToCheckout}
                  disabled={unavailableItems.length > 0}
                  className="btn-primary"
                  style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', opacity: unavailableItems.length > 0 ? 0.5 : 1, cursor: unavailableItems.length > 0 ? 'not-allowed' : 'pointer' }}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </button>
              }
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                marginTop: '0.75rem',
                fontSize: '0.72rem',
                color: 'var(--text-muted)'
              }}
            >
              <ShieldCheck size={13} color="#1F7A4D" />
              <span>Insured shipping · 7-day easy returns</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
