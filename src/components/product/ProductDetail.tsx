'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Share2,
  Truck,
  ChevronRight,
  ChevronLeft,
  X,
  Plus,
  Mail,
  Gift,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlarmClock
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product, SizeOption } from '@/lib/types';
import { LEGAL } from '@/lib/legal';
import ProductCard from '@/components/product/ProductCard';
import ProductReviews, { Stars } from '@/components/product/ProductReviews';
import { averageRating, useReviews } from '@/lib/reviews';


function deliveryDate(days: number) {
  return new Date(Date.now() + days * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export default function ProductDetail({ slug }: { slug: string }) {
  const { products, productsLoaded } = useStore();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    // Admin-added products only exist after the browser catalog loads
    if (!productsLoaded) return <main className="product-page-main" style={{ minHeight: '70vh' }} />;
    return (
      <main className="product-page-main" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem', padding: '4rem 1.5rem' }}>
        <h1 className="product-page-title">We couldn&apos;t find that piece</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '420px' }}>
          It may have sold out or the link may be incorrect. Explore the rest of the collection instead.
        </p>
        <Link href="/shop" className="btn-primary" style={{ padding: '0.9rem 2rem' }}>Browse the collection</Link>
      </main>
    );
  }

  return <ProductView key={product.id} product={product} />;
}

function ProductView({ product }: { product: Product }) {
  const router = useRouter();
  const { 
    products, 
    addToCart, 
    formatPrice, 
    isInWishlist, 
    toggleWishlist, 
    checkPincode, 
    showToast 
  } = useStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const isFreeSizeProduct = product.sizes.length <= 1;
  // Never pre-select a size for multi-size pieces; a silent default leads to wrong-size orders
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(isFreeSizeProduct ? product.sizes[0] || 'Free Size' : null);
  const [sizeError, setSizeError] = useState(false);
  const sizeBlockRef = useRef<HTMLDivElement>(null);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{ checked: boolean; serviceable: boolean; city?: string; days?: number } | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    details: false,
    washcare: false,
    delivery: false,
    contact: false,
    reviews: false
  });

  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const mainBuyCtaRef = useRef<HTMLDivElement>(null);

  const { reviews: storeReviews, addReview } = useReviews();
  const allReviews = [...storeReviews.filter((r) => r.productId === product.id), ...product.reviews];
  const reviewAverage = averageRating(allReviews);

  const isFavorited = isInWishlist(product.id);
  const isSoldOut = !product.inStock || product.stockCount <= 0;
  // Single pack size: show it as a fact instead of a picker
  const isFreeSize = product.sizes.length <= 1;
  const savings = product.compareAtPrice && product.compareAtPrice > product.price ? product.compareAtPrice - product.price : 0;

  // Track scroll position to reveal sticky Add to Cart bar
  useEffect(() => {
    const handleScroll = () => {
      if (mainBuyCtaRef.current) {
        const rect = mainBuyCtaRef.current.getBoundingClientRect();
        setIsStickyVisible(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLightboxOpen]);

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput.trim()) return;
    const res = checkPincode(pincodeInput);
    setPincodeResult({ checked: true, ...res });
  };

  const requireSize = (): SizeOption | null => {
    if (selectedSize) return selectedSize;
    setSizeError(true);
    sizeBlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return null;
  };

  const handleAddToCart = () => {
    const size = requireSize();
    if (size) addToCart(product, size, undefined, 1);
  };

  const handleBuyNow = () => {
    const size = requireSize();
    if (!size) return;
    addToCart(product, size, undefined, 1);
    router.push('/checkout');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, url: window.location.href });
      } catch {}
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard', 'info');
    }
  };

  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const galleryCount = product.images.length;

  // Mobile carousel only; on desktop the track is a static grid and never scrolls
  const goToImage = (idx: number) => {
    const track = galleryTrackRef.current;
    const target = track?.children[idx] as HTMLElement | undefined;
    if (track && target) track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    setSelectedImage(idx);
  };

  const handleGalleryScroll = () => {
    const track = galleryTrackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    if (!track || !first) return;
    const idx = Math.min(galleryCount - 1, Math.round(track.scrollLeft / (first.offsetWidth + 8)));
    if (idx !== selectedImage) setSelectedImage(idx);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Same category first, in-stock first
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .sort((a, b) => Number(b.inStock && b.stockCount > 0) - Number(a.inStock && a.stockCount > 0))
    .slice(0, 4);

  const badges = [
    { icon: <ShieldCheck size={26} strokeWidth={1.6} />, label: 'Solid metal build' },
    { icon: <Gift size={26} strokeWidth={1.6} />, label: 'Gift-ready box' },
    { icon: <Truck size={26} strokeWidth={1.6} />, label: 'Ships in 1–3 days' },
    { icon: <Lock size={26} strokeWidth={1.6} />, label: 'Secure payment' }
  ];

  const accordion = (key: string, title: string, body: React.ReactNode, id?: string) => (
    <div className="pdp-accordion" id={id}>
      <button className="pdp-accordion-header" onClick={() => toggleAccordion(key)} aria-expanded={openAccordions[key]}>
        <span>{title}</span>
        <span className={`pdp-accordion-icon ${openAccordions[key] ? 'is-open' : ''}`}><Plus size={14} /></span>
      </button>
      {openAccordions[key] && <div className="pdp-accordion-body">{body}</div>}
    </div>
  );

  return (
    <main className="pdp-main">

      {/* Main Product Hero: image stack left, sticky details right (stacked on mobile) */}
      <div className="pdp-layout">
        {/* Gallery: one large image then a two-up grid on desktop; swipeable carousel on mobile */}
        <div className="pdp-gallery">
          <div
            ref={galleryTrackRef}
            className={`pdp-gallery-track ${galleryCount % 2 === 0 ? 'is-even' : ''}`}
            onScroll={handleGalleryScroll}
          >
            {product.images.map((img, idx) => (
              <button key={idx} type="button" className="pdp-gallery-item" onClick={() => openLightbox(idx)} aria-label={`Zoom image ${idx + 1}`}>
                <img
                  src={img}
                  alt={`${product.title}, designer lighter, view ${idx + 1} of ${galleryCount}`}
                  fetchPriority={idx === 0 ? 'high' : undefined}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </button>
            ))}
          </div>

          {galleryCount > 1 && (
            <div className="pdp-gallery-counter">
              <button type="button" onClick={() => goToImage(Math.max(0, selectedImage - 1))} disabled={selectedImage === 0} aria-label="Previous image">
                <ChevronLeft size={16} />
              </button>
              <span>{selectedImage + 1}/{galleryCount}</span>
              <button type="button" onClick={() => goToImage(Math.min(galleryCount - 1, selectedImage + 1))} disabled={selectedImage === galleryCount - 1} aria-label="Next image">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Details panel */}
        <div className="pdp-info">
          <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">•</span>
            <Link href="/shop">Shop</Link>
            <span aria-hidden="true">•</span>
            <span className="is-current">{product.title}</span>
          </nav>

          <h1 className="pdp-title">{product.title}</h1>

          <div className="pdp-price">
            <span>{formatPrice(product.price)}</span>
            {savings > 0 && (
              <>
                <s>{formatPrice(product.compareAtPrice!)}</s>
                <em>{Math.round((savings / product.compareAtPrice!) * 100)}% off</em>
              </>
            )}
          </div>
          <p className="pdp-tax">Tax included. Free shipping above {formatPrice(LEGAL.freeShippingThreshold)}.</p>

          {allReviews.length > 0 && (
            <button
              type="button"
              className="pdp-rating"
              onClick={() => {
                setOpenAccordions((prev) => ({ ...prev, reviews: true }));
                setTimeout(() => document.getElementById('product-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
              }}
            >
              <Stars value={Math.round(reviewAverage)} size={13} />
              <span>{reviewAverage.toFixed(1)} · {allReviews.length} {allReviews.length === 1 ? 'review' : 'reviews'}</span>
            </button>
          )}

          {!isFreeSize && (
            <div className="variant-option-block" ref={sizeBlockRef}>
              <span className="variant-label-title" id="sizeLabel" style={sizeError ? { color: '#B3261E' } : undefined}>
                {selectedSize ? `Option: ${selectedSize}` : sizeError ? 'Please select an option' : 'Select an option'}
              </span>
              <div className="size-pill-row" role="radiogroup" aria-labelledby="sizeLabel">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    role="radio"
                    aria-checked={selectedSize === sz}
                    className={`size-pill ${selectedSize === sz ? 'is-active' : ''}`}
                    onClick={() => {
                      setSelectedSize(sz);
                      setSizeError(false);
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isSoldOut && product.stockCount <= 5 && (
            <p className="pdp-stock"><AlarmClock size={15} /> Only {product.stockCount} left</p>
          )}

          <div ref={mainBuyCtaRef} className="pdp-ctas">
            <button onClick={handleAddToCart} className="pdp-btn pdp-btn--cart" disabled={isSoldOut}>
              {isSoldOut ? 'Sold out' : 'Add to cart'}
            </button>
            {isSoldOut ? (
              <a
                className="pdp-btn pdp-btn--buy"
                href={`https://wa.me/${LEGAL.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi! Please let me know when "${product.title}" is back in stock.`)}`}
              >
                Notify me on WhatsApp
              </a>
            ) : (
              <button onClick={handleBuyNow} className="pdp-btn pdp-btn--buy">Buy it now</button>
            )}
          </div>

          <div className="pdp-icon-row">
            <button type="button" onClick={() => toggleWishlist(product.id)} aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={isFavorited}>
              <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
            <a href={`mailto:?subject=${encodeURIComponent(product.title)}&body=${encodeURIComponent(`https://${LEGAL.website}/product/${product.slug}`)}`} aria-label="Share by email">
              <Mail size={16} />
            </a>
            <button type="button" onClick={handleShare} aria-label="Share">
              <Share2 size={16} />
            </button>
          </div>

          <p className="pdp-description">{product.description}</p>

          <ul className="pdp-badges">
            {badges.map((b) => (
              <li key={b.label}>
                {b.icon}
                <span>{b.label}</span>
              </li>
            ))}
          </ul>

          <div className="pdp-accordions">
            {accordion('details', 'Product details', (
              <ul className="pdp-detail-list">
                {[
                  ['Material & finish', product.fabric],
                  ['Type', product.craft],
                  ['Colour', product.color],
                  ['Made in', product.origin],
                  ...product.craftsmanshipDetails.map((d) => ['', d])
                ].map(([label, value], i) => (
                  <li key={i}>
                    <CheckCircle2 size={14} />
                    <span>{label && <strong>{label}: </strong>}{value}</span>
                  </li>
                ))}
              </ul>
            ))}

            {accordion('washcare', 'Care & safety', (
              <ul className="pdp-bullets">
                {product.washCare.map((w) => <li key={w}>{w}</li>)}
              </ul>
            ))}

            {accordion('delivery', 'Delivery & returns', (
              <>
                <p>
                  <strong>Ships within 1–3 working days</strong>, delivered in 3–7 working days across India. Free shipping on orders above {formatPrice(LEGAL.freeShippingThreshold)}. <Link href="/pages/shipping-policy">Shipping policy</Link>
                </p>
                <p>
                  <strong>Damaged or wrong item?</strong> Tell us within {LEGAL.returnWindowDays} days of delivery with photos of the unused product and we&apos;ll replace or refund it. Lighters that have been filled or used can&apos;t be returned for safety reasons. <Link href="/pages/return-exchange-policy">Return policy</Link>
                </p>
                <form onSubmit={handlePincodeCheck} className="pdp-pincode">
                  <Truck size={15} />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Check delivery: 6-digit PIN code"
                    aria-label="PIN code"
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  />
                  <button type="submit">Check</button>
                </form>
                {pincodeResult?.checked && (
                  pincodeResult.serviceable ? (
                    // Same estimate as checkout's standard delivery: courier days + 2 days processing
                    <p style={{ color: '#0F6938', fontWeight: 500 }}>
                      ✓ Delivery {pincodeResult.city ? `to ${pincodeResult.city} ` : `to ${pincodeInput} `}by {deliveryDate((pincodeResult.days ?? 4) + 2)}
                    </p>
                  ) : (
                    <p style={{ color: '#B3261E' }}>Please enter a valid 6-digit PIN code.</p>
                  )
                )}
              </>
            ))}

            {accordion('contact', 'Talk to us', (
              <p>
                Questions about finishes, refills or gifting? WhatsApp us at{' '}
                <a href={`https://wa.me/${LEGAL.whatsapp.replace(/\D/g, '')}`}>{LEGAL.whatsapp}</a>{' '}
                or email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>. We reply within one business day.
              </p>
            ))}

            {accordion('reviews', allReviews.length > 0 ? `Reviews (${allReviews.length})` : 'Write a review', (
              <ProductReviews product={product} reviews={allReviews} onSubmit={addReview} />
            ), 'product-reviews')}
          </div>
        </div>
      </div>

      {/* You may also like */}
      {relatedProducts.length > 0 && (
        <section className="pdp-related">
          <h2 className="pdp-related-title">You may also like</h2>
          <div className="pdp-related-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Sticky Add to Cart Bar on Scroll */}
      <div className={`product-sticky-cart-bar ${isStickyVisible ? 'is-visible' : ''}`}>
        <div className="sticky-cart-info-left">
          <div className="sticky-cart-thumb">
            <img src={product.images[0]} alt={product.title} />
          </div>
          <div className="sticky-cart-meta">
            <span className="sticky-cart-title">{product.title}</span>
            <span className="sticky-cart-sub">{product.categoryLabel}{isFreeSize ? ` · ${product.sizes[0]}` : selectedSize ? ` · ${selectedSize}` : ' · Select an option'}</span>
          </div>
        </div>

        <div className="sticky-cart-actions">
          <div className="sticky-cart-price">
            {formatPrice(product.price)}
          </div>
          <button
            onClick={handleAddToCart}
            className="btn-add-to-cart"
            disabled={isSoldOut}
            style={{ width: '180px', height: '44px', ...(isSoldOut && { opacity: 0.45, cursor: 'not-allowed' }) }}
          >
            {isSoldOut ? 'Sold out' : selectedSize ? 'Add to cart' : 'Select an option'}
          </button>
        </div>
      </div>


      {/* 7. Lightbox Zoom Fullscreen Modal */}
      {isLightboxOpen && (
        <div className="lightbox-modal-wrap" onClick={() => setIsLightboxOpen(false)}>
          <button 
            className="lightbox-close-btn"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close image zoom"
          >
            <X size={32} />
          </button>

          <div 
            className="lightbox-image-box"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={product.images[lightboxIndex]} 
              alt={product.title} 
            />

            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex((prev) => (prev - 1 + product.images.length) % product.images.length)}
                  className="gallery-nav-arrow gallery-nav-prev"
                  style={{ left: '-60px' }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => setLightboxIndex((prev) => (prev + 1) % product.images.length)}
                  className="gallery-nav-arrow gallery-nav-next"
                  style={{ right: '-60px' }}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
