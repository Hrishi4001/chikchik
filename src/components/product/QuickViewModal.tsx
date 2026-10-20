'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Check, ShieldCheck, Truck, Sparkles, Scissors, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { SizeOption, StitchingOption } from '@/lib/types';

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, formatPrice, checkPincode } = useStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<SizeOption>('');
  const [selectedStitching, setSelectedStitching] = useState<StitchingOption | undefined>(undefined);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{ checked: boolean; serviceable: boolean; city?: string; days?: number } | null>(null);

  if (!quickViewProduct) return null;

  const currentSize = quickViewProduct.sizes.includes(selectedSize)
    ? selectedSize
    : quickViewProduct.sizes[0] || '';

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput.trim()) return;
    const res = checkPincode(pincodeInput);
    setPincodeResult({ checked: true, ...res });
  };

  const handleAddToCart = () => {
    addToCart(quickViewProduct, currentSize, selectedStitching, 1);
    setQuickViewProduct(null);
  };

  return (
    <div className="modal-backdrop" onClick={() => setQuickViewProduct(null)}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '920px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-modal)',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '1.5rem',
          position: 'relative',
          animation: 'slideInUp 0.3s var(--ease-luxury) forwards'
        }}
      >
        <button
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 20,
            padding: '0.4rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            color: 'var(--text-primary)'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Gallery Side */}
          <div style={{ padding: '1.5rem', backgroundColor: '#FAF8F5' }}>
            <div
              style={{
                width: '100%',
                aspectRatio: '3/4',
                borderRadius: '6px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-subtle)',
                marginBottom: '1rem'
              }}
            >
              <img
                src={quickViewProduct.images[selectedImage] || quickViewProduct.images[0]}
                alt={quickViewProduct.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnail selector */}
            {quickViewProduct.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '60px',
                      height: '75px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: selectedImage === idx ? '2px solid #111111' : '1px solid var(--border-medium)',
                      padding: 0
                    }}
                  >
                    <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Action Side */}
          <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
              {quickViewProduct.categoryLabel} • {quickViewProduct.sizes.join(' / ')}
            </span>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem', lineHeight: 1.2 }}>
              {quickViewProduct.title}
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.4 }}>
              {quickViewProduct.subtitle}
            </p>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatPrice(quickViewProduct.price + (selectedStitching?.price || 0))}
              </span>
              {quickViewProduct.compareAtPrice && (
                <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {formatPrice(quickViewProduct.compareAtPrice)}
                </span>
              )}
              <span className="badge-gold">
                Certified Handloom
              </span>
            </div>

            {/* Size Selector */}
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Option
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {quickViewProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '0.55rem 1rem',
                      border: currentSize === size ? '1.5px solid var(--text-primary)' : '1px solid var(--border-medium)',
                      backgroundColor: currentSize === size ? 'var(--text-primary)' : '#FFFFFF',
                      color: currentSize === size ? '#FFFFFF' : 'var(--text-primary)',
                      borderRadius: '4px',
                      fontSize: '0.82rem',
                      fontWeight: currentSize === size ? 600 : 400,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional add-ons (unused for lighters; kept for products that define them) */}
            {quickViewProduct.stitchingOptions && quickViewProduct.stitchingOptions.length > 0 && (
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <Scissors size={14} color="#111111" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Add-on
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {quickViewProduct.stitchingOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedStitching(opt.id === selectedStitching?.id ? undefined : opt)}
                      style={{
                        textAlign: 'left',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '4px',
                        border: selectedStitching?.id === opt.id ? '1.5px solid #111111' : '1px solid var(--border-subtle)',
                        backgroundColor: selectedStitching?.id === opt.id ? '#FDF9F8' : 'var(--bg-canvas)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{opt.name}</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{opt.description}</p>
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#111111' }}>
                        {opt.price === 0 ? 'Included' : `+ ${formatPrice(opt.price)}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Pincode Checker */}
            <div style={{ marginTop: '1.25rem', padding: '0.85rem', backgroundColor: '#F9F7F3', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <Truck size={14} color="var(--accent-emerald)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  Delivery Serviceability
                </span>
              </div>
              <form onSubmit={handlePincodeCheck} style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  placeholder="Enter 6-digit Pincode (e.g. 110001)"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.45rem 0.65rem',
                    fontSize: '0.78rem',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '3px',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.72rem' }}>
                  Check
                </button>
              </form>

              {pincodeResult?.checked && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.72rem' }}>
                  {pincodeResult.serviceable ? (
                    <p style={{ color: 'var(--accent-emerald)', fontWeight: 500 }}>
                      ✓ Serviceable to {pincodeResult.city || 'your location'}. Delivery in {pincodeResult.days || 3} business days.
                    </p>
                  ) : (
                    <p style={{ color: 'red' }}>
                      Pincode not currently serviceable for direct express transit.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Add to Bag CTA */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={handleAddToCart}
                className="btn-primary"
                style={{ flex: 1, padding: '0.9rem' }}
              >
                Add to Shopping Bag
              </button>
              <Link
                href={`/product/${quickViewProduct.slug}`}
                onClick={() => setQuickViewProduct(null)}
                className="btn-secondary"
                style={{ padding: '0.9rem 1.25rem' }}
                title="View full product page with zoom and craftsmanship story"
              >
                <span>Full Details</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
