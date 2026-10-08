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
  Minus, 
  Check, 
  Maximize2,
  Star,
  CheckCircle2,
  AlarmClock
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product, SizeOption } from '@/lib/types';
import { LEGAL, SIZE_CHART } from '@/lib/legal';
import ProductCard from '@/components/product/ProductCard';
import ProductReviews, { Stars } from '@/components/product/ProductReviews';
import { averageRating, useReviews } from '@/lib/reviews';

// Catalog uses "XXL"; the size chart uses "2XL"
const chartSize = (size: string) => (size === 'XXL' ? '2XL' : size);

function deliveryDate(days: number) {
  return new Date(Date.now() + days * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export default function ProductDetail({ slug }: { slug: string }) {
  const { products, hydrated } = useStore();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    // Admin-added products only exist after the browser catalog loads
    if (!hydrated) return <main className="product-page-main" style={{ minHeight: '70vh' }} />;
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
  const [quantity, setQuantity] = useState(1);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{ checked: boolean; serviceable: boolean; city?: string; days?: number } | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    details: true,
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
  const isFreeSize = product.sizes.length <= 1 && /free/i.test(product.sizes[0] || 'Free Size');
  const savings = product.compareAtPrice && product.compareAtPrice > product.price ? product.compareAtPrice - product.price : 0;
  const chartRows = SIZE_CHART.filter((r) => product.sizes.some((s) => chartSize(s) === r.size));

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
    if (!isSizeGuideOpen && !isLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsSizeGuideOpen(false);
      setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSizeGuideOpen, isLightboxOpen]);

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
    if (size) addToCart(product, size, undefined, quantity);
  };

  const handleBuyNow = () => {
    const size = requireSize();
    if (!size) return;
    addToCart(product, size, undefined, quantity);
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

  const goToImage = (idx: number) => {
    const track = galleryTrackRef.current;
    if (track) track.scrollTo({ left: idx * track.clientWidth, behavior: 'smooth' });
    setSelectedImage(idx);
  };

  const handleGalleryScroll = () => {
    const track = galleryTrackRef.current;
    if (!track) return;
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    if (idx !== selectedImage) setSelectedImage(idx);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Structured Data Schema for SEO
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: product.images,
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Heva Elegance'
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.hevaelegance.com/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount
      }
    })
  };

  // Same category first, in-stock first
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .sort((a, b) => Number(b.inStock && b.stockCount > 0) - Number(a.inStock && a.stockCount > 0))
    .slice(0, 4);

  return (
    <main className="product-page-main">
      {/* Product JSON-LD for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* 2. Main Product Hero (Gallery Left 58% + Sticky Details Right 42%) */}
      <div className="product-hero-layout">
        
        {/* Left Column: Gallery */}
        <div className="product-gallery-strip">
          {/* Thumbnails list on left */}
          <div className="product-thumbs-column">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => goToImage(idx)}
                className={`product-thumb-button ${selectedImage === idx ? 'is-active' : ''}`}
                aria-label={`View image ${idx + 1}`}
              >
                <img src={img} alt={`${product.title} view ${idx + 1}`} loading="lazy" />
              </button>
            ))}
          </div>

          {/* Large Main Image Display: swipeable track */}
          <div className="product-main-frame">
            <div
              ref={galleryTrackRef}
              className="product-main-track"
              onScroll={handleGalleryScroll}
            >
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title} view ${idx + 1}`}
                  fetchPriority={idx === 0 ? 'high' : undefined}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  onClick={() => openLightbox(idx)}
                />
              ))}
            </div>

            {product.images.length > 1 && (
              <div className="gallery-dots">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    className={selectedImage === idx ? 'is-active' : ''}
                    onClick={() => goToImage(idx)}
                    aria-label={`Show image ${idx + 1} of ${product.images.length}`}
                  />
                ))}
              </div>
            )}

            <button
              className="gallery-expand-button"
              onClick={() => openLightbox(selectedImage)}
              aria-label="Expand image"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        {/* Right Column: Sticky Product Info */}
        <div className="product-info-column">
          {/* Brand Vendor Link */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/shop" className="product-vendor-badge">
              Heva Elegance
            </Link>
            <button 
              onClick={handleShare}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#666666' }}
              title="Share creation"
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>
          </div>

          {/* Product Title */}
          <h1 className="product-page-title">
            {product.title}
          </h1>

          {allReviews.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setOpenAccordions((prev) => ({ ...prev, reviews: true }));
                setTimeout(() => document.getElementById('product-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '-0.5rem' }}
            >
              <Stars value={Math.round(reviewAverage)} size={13} />
              <span>{reviewAverage.toFixed(1)} · {allReviews.length} {allReviews.length === 1 ? 'review' : 'reviews'}</span>
            </button>
          )}

          {/* Price & Taxes Notice */}
          <div className="product-price-container">
            <div className="product-regular-price" style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.6rem' }}>
              <span>{formatPrice(product.price)}</span>
              {savings > 0 && (
                <>
                  <span style={{ fontSize: '0.9em', color: 'var(--text-muted)', textDecoration: 'line-through', fontWeight: 400 }}>
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.04em', color: '#1B4435', backgroundColor: '#E8F3EC', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>
                    {Math.round((savings / product.compareAtPrice!) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="product-taxes-notice">
              Inclusive of all taxes. Free shipping in India on orders above {formatPrice(LEGAL.freeShippingThreshold)}.
            </p>
          </div>

          <hr className="product-divider-line" />

          {/* Short Description */}
          <p className="product-lead-description">
            {product.description}
          </p>

          <dl className="product-facts">
            <div>
              <dt>Colour</dt>
              <dd>
                <span className="variant-select-swatch" style={{ position: 'static', backgroundColor: product.colorHex }} />
                {product.color}
              </dd>
            </div>
            <div>
              <dt>Fabric</dt>
              <dd>{product.fabric}</dd>
            </div>
            {isFreeSize && (
              <div>
                <dt>Size</dt>
                <dd>Free size</dd>
              </div>
            )}
          </dl>

          {!isFreeSize && (
            <div className="variant-option-block" ref={sizeBlockRef}>
              <span className="variant-label-title" id="sizeLabel" style={sizeError ? { color: '#B3261E' } : undefined}>
                {selectedSize ? `Size: ${selectedSize}` : sizeError ? 'Please select a size' : 'Select size'}
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

          {!isFreeSize && (
            <p style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.35rem 0.75rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <button
                id="sizeGuideTrigger"
                className="size-guide-trigger-link"
                onClick={() => setIsSizeGuideOpen(true)}
              >
                Size Guide
              </button>
              <span>Between sizes? Pick the larger one — free size exchange within {LEGAL.returnWindowDays} days.</span>
            </p>
          )}

          {/* Buy Action Group: Quantity + Add to Cart */}
          <div ref={mainBuyCtaRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="product-cta-group">
              {/* Quantity pill */}
              <div className="qty-control-wrapper" hidden={isSoldOut} style={isSoldOut ? { display: 'none' } : undefined}>
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(Math.min(Math.max(1, product.stockCount), quantity + 1))}
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className="btn-add-to-cart"
                disabled={isSoldOut}
                style={isSoldOut ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
              >
                {isSoldOut ? 'Sold out' : 'Add to cart'}
              </button>
            </div>

            {isSoldOut ? (
              <a
                className="btn-buy-now"
                href={`https://wa.me/${LEGAL.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi! Please let me know when "${product.title}" is back in stock.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Notify me on WhatsApp
              </a>
            ) : (
              <button
                onClick={handleBuyNow}
                className="btn-buy-now"
              >
                Buy it now
              </button>
            )}
          </div>

          {/* Stock + Service checklist */}
          <ul className="product-service-list">
            {!isSoldOut && product.stockCount <= 5 && (
              <li className="is-stock">
                <AlarmClock size={16} />
                <span>Only {product.stockCount} left</span>
              </li>
            )}
            <li><Check size={15} /><span>Ships within 1–3 working days</span></li>
            <li><Check size={15} /><span>Cash on delivery &amp; secure online payment</span></li>
            <li><Check size={15} /><span>{LEGAL.returnWindowDays}-day easy returns &amp; exchange</span></li>
          </ul>

          {/* Wishlist Action */}
          <button
            onClick={() => toggleWishlist(product.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: isFavorited ? 'var(--color-brand-maroon, #580F00)' : '#666666',
              padding: '0.4rem 0',
              cursor: 'pointer'
            }}
          >
            <Heart size={16} fill={isFavorited ? 'var(--color-brand-maroon, #580F00)' : 'none'} />
            <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
          </button>

          <hr className="product-divider-line" />

          {/* Estimated Delivery Pincode Checker */}
          <div className="pincode-estimator-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 600, color: '#580F00' }}>
              <Truck size={14} />
              <span>ESTIMATE DELIVERY TO YOUR CITY</span>
            </div>
            <form onSubmit={handlePincodeCheck} className="pincode-input-row">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit PIN code"
                aria-label="PIN code"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                className="pincode-text-input"
              />
              <button type="submit" className="pincode-check-btn">
                Check
              </button>
            </form>

            {pincodeResult?.checked && (
              <div style={{ fontSize: '0.78rem', marginTop: '0.2rem' }}>
                {pincodeResult.serviceable ? (
                  // Same estimate as checkout's standard delivery: courier days + 2 days processing
                  <p style={{ color: '#0F6938', fontWeight: 500 }}>
                    ✓ Delivery {pincodeResult.city ? `to ${pincodeResult.city} ` : `to ${pincodeInput} `}by {deliveryDate((pincodeResult.days ?? 4) + 2)}
                  </p>
                ) : (
                  <p style={{ color: '#B3261E' }}>
                    Please enter a valid 6-digit PIN code.
                  </p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 3. Section 2: "More Information" (Split Layout with Editorial Image & Accordions) */}
      <section className="section-more-info">
        <div className="more-info-layout">
          {/* Editorial portrait image */}
          {product.images[2] && (
            <div className="more-info-editorial-media">
              <img src={product.images[2]} alt={`${product.title} detail`} loading="lazy" />
            </div>
          )}

          {/* Right column: Heading & Accordions */}
          <div className="more-info-content">
            <h2 className="more-info-heading">
              More Information
            </h2>

            {/* Accordion 1: Details */}
            <div className="openform-accordion-item">
              <button 
                className="openform-accordion-header"
                onClick={() => toggleAccordion('details')}
                aria-expanded={openAccordions.details}
              >
                <span>Details</span>
                <span className={`openform-accordion-icon ${openAccordions.details ? 'is-open' : ''}`}>
                  <Plus size={16} />
                </span>
              </button>
              {openAccordions.details && (
                <div className="openform-accordion-body">
                  <p style={{ marginBottom: '0.8rem' }}>{product.description}</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: 0 }}>
                    {[
                      ['Fabric', product.fabric],
                      ['Craft', product.craft],
                      ['Colour', product.color],
                      ['Sizes', isFreeSize ? 'Free size' : product.sizes.join(', ')],
                      ['Made in', product.origin],
                      ...product.craftsmanshipDetails.filter((d) => !/curated by/i.test(d)).map((d) => ['', d])
                    ].map(([label, value], i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={14} color="var(--color-brand-maroon, #580F00)" />
                        <span>{label && <strong>{label}: </strong>}{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Accordion 2: Washcare */}
            <div className="openform-accordion-item">
              <button 
                className="openform-accordion-header"
                onClick={() => toggleAccordion('washcare')}
                aria-expanded={openAccordions.washcare}
              >
                <span>Washcare</span>
                <span className={`openform-accordion-icon ${openAccordions.washcare ? 'is-open' : ''}`}>
                  <Plus size={16} />
                </span>
              </button>
              {openAccordions.washcare && (
                <div className="openform-accordion-body">
                  <ul style={{ paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {product.washCare.map((w) => <li key={w}>{w}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Accordion 3: Delivery & Returns */}
            <div className="openform-accordion-item">
              <button 
                className="openform-accordion-header"
                onClick={() => toggleAccordion('delivery')}
                aria-expanded={openAccordions.delivery}
              >
                <span>Delivery &amp; Returns</span>
                <span className={`openform-accordion-icon ${openAccordions.delivery ? 'is-open' : ''}`}>
                  <Plus size={16} />
                </span>
              </button>
              {openAccordions.delivery && (
                <div className="openform-accordion-body">
                  <p style={{ marginBottom: '0.6rem' }}>
                    <strong>Ships within 1–3 working days</strong>, delivered in 3–7 working days across India. Free shipping on orders above {formatPrice(LEGAL.freeShippingThreshold)}. <Link href="/pages/shipping-policy" style={{ textDecoration: 'underline' }}>Shipping policy</Link>
                  </p>
                  <p>
                    <strong>Easy {LEGAL.returnWindowDays}-day returns &amp; exchange:</strong> Unused pieces with tags intact can be returned or exchanged within {LEGAL.returnWindowDays} days of delivery. <Link href="/pages/return-exchange-policy" style={{ textDecoration: 'underline' }}>Return policy</Link>
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 4: Contact us */}
            <div className="openform-accordion-item">
              <button 
                className="openform-accordion-header"
                onClick={() => toggleAccordion('contact')}
                aria-expanded={openAccordions.contact}
              >
                <span>Contact us</span>
                <span className={`openform-accordion-icon ${openAccordions.contact ? 'is-open' : ''}`}>
                  <Plus size={16} />
                </span>
              </button>
              {openAccordions.contact && (
                <div className="openform-accordion-body">
                  <p style={{ marginBottom: '0.6rem' }}>
                    Questions about fit, fabric or delivery? WhatsApp us at{' '}
                    <a href={`https://wa.me/${LEGAL.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{LEGAL.whatsapp}</a>{' '}
                    or email <a href={`mailto:${LEGAL.email}`} style={{ textDecoration: 'underline' }}>{LEGAL.email}</a>. We reply within one business day.
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 5: Product Reviews */}
            <div className="openform-accordion-item" id="product-reviews">
              <button 
                className="openform-accordion-header"
                onClick={() => toggleAccordion('reviews')}
                aria-expanded={openAccordions.reviews}
              >
                <span>Reviews ({allReviews.length})</span>
                <span className={`openform-accordion-icon ${openAccordions.reviews ? 'is-open' : ''}`}>
                  <Plus size={16} />
                </span>
              </button>
              {openAccordions.reviews && (
                <div className="openform-accordion-body">
                  <ProductReviews product={product} reviews={allReviews} onSubmit={addReview} />
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 4. Section 3: "You may also like" */}
      {relatedProducts.length > 0 && (
        <section className="section-recommendations">
          <div className="recommendations-header">
            <h2 className="recommendations-title">
              You may also like
            </h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '1.5rem' 
          }}>
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
            <span className="sticky-cart-sub">{product.color}{isFreeSize ? '' : selectedSize ? ` · Size ${selectedSize}` : ' · Select a size'}</span>
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
            {isSoldOut ? 'Sold out' : selectedSize ? 'Add to cart' : 'Select size'}
          </button>
        </div>
      </div>

      {/* 6. Size Guide Modal Popup  */}
      {isSizeGuideOpen && (
        <div className="modal-backdrop" onClick={() => setIsSizeGuideOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '95%',
              maxWidth: '640px',
              backgroundColor: '#FFFFFF',
              borderRadius: '6px',
              padding: '2.5rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <button 
              onClick={() => setIsSizeGuideOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666666'
              }}
              aria-label="Close size guide"
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-brand-maroon, #580F00)', fontWeight: 600 }}>
                Garment Measurement Guide
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading-family)', fontSize: '1.6rem', fontWeight: 400, marginTop: '0.25rem', color: '#580F00' }}>
                Size Chart
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#666666', marginTop: '0.2rem' }}>
                All measurements shown are actual garment measurements in inches.
              </p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'center' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #580F00', color: '#580F00', fontWeight: 600 }}>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Size</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Bust</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Waist</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Hip</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Length</th>
                </tr>
              </thead>
              <tbody>
                {chartRows.map((r) => (
                  <tr key={r.size} style={{ borderBottom: '1px solid #EBEBEB' }}>
                    <td style={{ padding: '0.65rem 0.5rem', textAlign: 'left', fontWeight: 600 }}>{product.sizes.find((sz) => chartSize(sz) === r.size)}</td>
                    <td>{r.bust}&quot;</td><td>{r.waist}&quot;</td><td>{r.hip}&quot;</td><td>{r.length}&quot;</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#FAF8F5', borderRadius: '4px', fontSize: '0.8rem', color: '#444444', lineHeight: 1.6 }}>
              <strong>Between sizes?</strong> Message us on WhatsApp at {LEGAL.whatsapp} and we&apos;ll help you pick the right fit. <Link href="/pages/size-chart" style={{ textDecoration: 'underline' }}>How to measure</Link>
            </div>
          </div>
        </div>
      )}

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
