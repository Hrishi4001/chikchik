'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Share2, 
  Globe, 
  ShieldCheck, 
  Truck, 
  Lock, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Plus, 
  Minus, 
  Check, 
  Sparkles,
  Maximize2,
  Star,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { SizeOption, Product } from '@/lib/types';
import ProductCard from '@/components/product/ProductCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function deliveryDate(days: number) {
  return new Date(Date.now() + days * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export default function ProductDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const { 
    products, 
    addToCart, 
    formatPrice, 
    isInWishlist, 
    toggleWishlist, 
    checkPincode, 
    showToast 
  } = useStore();

  const product = products.find((p) => p.slug === slug) || 
                  products.find((p) => p.slug === 'ella-tunic-citrine') || 
                  products[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<SizeOption>(product.sizes[0] || 'XS');
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

  const isFavorited = isInWishlist(product.id);
  const unitPrice = product.price;

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

  const handleAddToCart = () => {
    addToCart(product, selectedSize, undefined, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, undefined, quantity);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard', 'info');
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.9,
      reviewCount: product.reviewCount || 18
    }
  };

  // Curated recommendations (excluding current product)
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="product-page-main">
      {/* Product JSON-LD for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="product-breadcrumb">
        <Link href="/">Home</Link>
        <span className="product-breadcrumb-sep">/</span>
        <Link href={`/shop?category=${product.category}`}>{product.categoryLabel}</Link>
        <span className="product-breadcrumb-sep">/</span>
        <span className="product-breadcrumb-current">{product.title}</span>
      </nav>

      {/* 2. Main Product Hero (Gallery Left 58% + Sticky Details Right 42%) */}
      <div className="product-hero-layout">
        
        {/* Left Column: Gallery */}
        <div className="product-gallery-strip">
          {/* Thumbnails list on left */}
          <div className="product-thumbs-column">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`product-thumb-button ${selectedImage === idx ? 'is-active' : ''}`}
                aria-label={`View image ${idx + 1}`}
              >
                <img src={img} alt={`${product.title} view ${idx + 1}`} loading="lazy" />
              </button>
            ))}
          </div>

          {/* Large Main Image Display */}
          <div 
            className="product-main-frame"
            onClick={() => openLightbox(selectedImage)}
          >
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.title}
              fetchPriority="high"
            />

            {/* Prev / Next Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="gallery-nav-arrow gallery-nav-prev"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="gallery-nav-arrow gallery-nav-next"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Zoom Cue */}
            <div className="gallery-zoom-badge">
              <Maximize2 size={13} />
              <span>Click to expand</span>
            </div>
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

          {/* Price & Taxes Notice */}
          <div className="product-price-container">
            <div className="product-regular-price">
              Regular price Rs. {product.price.toLocaleString('en-IN')}.00
            </div>
            <p className="product-taxes-notice">
              Taxes included. Free Shipping across India.
            </p>
            <p className="product-sku-tag">
              #{product.id.toUpperCase()}
            </p>
          </div>

          <hr className="product-divider-line" />

          {/* Short Description */}
          <p className="product-lead-description">
            {product.description}
          </p>

          {/* Variant: Color */}
          <div className="variant-option-block" style={{ marginTop: '0.25rem' }}>
            <div className="variant-label-title">
              <span>Color: {product.color || 'Citrine'}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div 
                className="color-swatch-circle"
                style={{ backgroundColor: product.colorHex || '#C3B53C' }}
                title={`Color: ${product.color || 'Citrine'}`}
              />
            </div>
          </div>

          {/* Variant: Fabric */}
          <div className="variant-option-block">
            <div className="variant-label-title">
              <span>Fabric: {product.fabric || 'Handwoven Mulberry Silk'}</span>
            </div>
          </div>

          {/* Variant: Size Selector with Size Guide Trigger */}
          <div className="variant-option-block">
            <div className="variant-label-title">
              <span>Size: <strong>{selectedSize}</strong></span>
              <button 
                id="sizeGuideTrigger"
                className="size-guide-trigger-link"
                onClick={() => setIsSizeGuideOpen(true)}
              >
                Size Guide
              </button>
            </div>
            <div className="size-pills-row">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`size-pill-btn ${selectedSize === sz ? 'is-selected' : ''}`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory Scarcity Notice */}
          <div className="stock-scarcity-notice">
            Only 5 left in stock. Order soon.
          </div>

          {/* Buy Action Group: Quantity + Add to Cart */}
          <div ref={mainBuyCtaRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="product-cta-group">
              {/* Quantity pill */}
              <div className="qty-control-wrapper">
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
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className="btn-add-to-cart"
              >
                Add to cart
              </button>
            </div>

            {/* Buy It Now button */}
            <button
              onClick={handleBuyNow}
              className="btn-buy-now"
            >
              Buy it now
            </button>
          </div>

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

          {/* Service Guarantees (4-box layout) */}
          <div className="product-features-grid">
            <div className="product-feature-card">
              <Globe size={18} />
              <span>Shipping worldwide</span>
            </div>
            <div className="product-feature-card">
              <Sparkles size={18} />
              <span>Made to Order</span>
            </div>
            <div className="product-feature-card">
              <Truck size={18} />
              <span>Ships in 12-15 working days</span>
            </div>
            <div className="product-feature-card">
              <Lock size={18} />
              <span>Secure online payment</span>
            </div>
          </div>

          {/* Estimated Delivery Pincode Checker */}
          <div className="pincode-estimator-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 600, color: '#580F00' }}>
              <Truck size={14} />
              <span>ESTIMATE DELIVERY TO YOUR CITY</span>
            </div>
            <form onSubmit={handlePincodeCheck} className="pincode-input-row">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit PIN code (e.g. 110001)"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value)}
                className="pincode-text-input"
              />
              <button type="submit" className="pincode-check-btn">
                Check
              </button>
            </form>

            {pincodeResult?.checked && (
              <div style={{ fontSize: '0.78rem', marginTop: '0.2rem' }}>
                {pincodeResult.serviceable ? (
                  <p style={{ color: '#0F6938', fontWeight: 500 }}>
                    ✓ Delivers to {pincodeResult.city} in 3–7 days · {deliveryDate(3)} – {deliveryDate(7)}
                  </p>
                ) : (
                  <p style={{ color: '#B3261E' }}>
                    Delivery available via India Post / Blue Dart in 3–7 days · {deliveryDate(3)} – {deliveryDate(7)}
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
          <div className="more-info-editorial-media">
            <img 
              src={product.images[2] || product.images[0]} 
              alt="Ella Tunic editorial silhouette" 
              loading="lazy" 
            />
          </div>

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
                  <p style={{ marginBottom: '0.8rem' }}>
                    An oversized tunic crafted from handwoven Mulberry Silk, with Pitta and Zardozi embroidery across the neckline. It features a V-neckline and relaxed sleeves. Length: 40&quot;.
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: 0 }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={14} color="var(--color-brand-maroon, #580F00)" />
                      <span><strong>Silhouette:</strong> Relaxed contemporary oversized drape</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={14} color="var(--color-brand-maroon, #580F00)" />
                      <span><strong>Neckline:</strong> Refined V-neck with hand Pitta &amp; Zardozi embroidery</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={14} color="var(--color-brand-maroon, #580F00)" />
                      <span><strong>Sleeves:</strong> Relaxed dropped-shoulder sleeves</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={14} color="var(--color-brand-maroon, #580F00)" />
                      <span><strong>Fabric:</strong> 100% Handwoven Mulberry Silk</span>
                    </li>
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
                  <p>Dry clean only.</p>
                  <p style={{ marginTop: '0.5rem', color: '#666666' }}>
                    Mulberry silk fibers and authentic metallic Zardozi embroidery require delicate handling. Store your garment folded inside a natural unbleached muslin bag away from direct sunlight. Avoid spraying perfumes or deodorants directly onto the embroidery.
                  </p>
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
                    <strong>Free Shipping in India within 12 - 15 business days.</strong>
                  </p>
                  <p>
                    <strong>Easy 7 day Exchange &amp; Return:</strong> If you are unhappy with your purchase, we are here to find you an easy solution. Heva Elegance products can be exchanged within 7 days for another size or product of the same or higher value. For any exchange or return, please reach out to us through the Contact page.
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
                    Tell us what&apos;s on your mind and we&apos;ll get back to you within 48 hours.
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 5: Product Reviews */}
            <div className="openform-accordion-item">
              <button 
                className="openform-accordion-header"
                onClick={() => toggleAccordion('reviews')}
                aria-expanded={openAccordions.reviews}
              >
                <span>Product Reviews ({product.reviews.length})</span>
                <span className={`openform-accordion-icon ${openAccordions.reviews ? 'is-open' : ''}`}>
                  <Plus size={16} />
                </span>
              </button>
              {openAccordions.reviews && (
                <div className="openform-accordion-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', color: '#580F00' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill="currentColor" />
                      ))}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>4.9 out of 5</span>
                    <span style={{ color: '#888888', fontSize: '0.8rem' }}>({product.reviews.length} reviews)</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {product.reviews.map((rev) => (
                      <div key={rev.id} style={{ padding: '0.85rem 0', borderTop: '1px solid #F0F0F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#777777', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 600, color: '#580F00' }}>{rev.author}</span>
                          <span>{rev.date}</span>
                        </div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0.2rem 0' }}>{rev.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: '#444444', lineHeight: 1.5 }}>&ldquo;{rev.comment}&rdquo;</p>
                      </div>
                    ))}
                  </div>
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
            <span className="sticky-cart-sub">{product.color || 'Citrine'} • Size {selectedSize}</span>
          </div>
        </div>

        <div className="sticky-cart-actions">
          <div className="sticky-cart-price">
            Rs. {product.price.toLocaleString('en-IN')}.00
          </div>
          <button
            onClick={handleAddToCart}
            className="btn-add-to-cart"
            style={{ width: '180px', height: '44px' }}
          >
            Add to cart
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
                Ella Tunic Sizing Chart
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
                <tr style={{ borderBottom: '1px solid #EBEBEB' }}><td style={{ padding: '0.65rem 0.5rem', textAlign: 'left', fontWeight: 600 }}>XS</td><td>36&quot;</td><td>38&quot;</td><td>42&quot;</td><td>40&quot;</td></tr>
                <tr style={{ borderBottom: '1px solid #EBEBEB' }}><td style={{ padding: '0.65rem 0.5rem', textAlign: 'left', fontWeight: 600 }}>S</td><td>38&quot;</td><td>40&quot;</td><td>44&quot;</td><td>40&quot;</td></tr>
                <tr style={{ borderBottom: '1px solid #EBEBEB' }}><td style={{ padding: '0.65rem 0.5rem', textAlign: 'left', fontWeight: 600 }}>M</td><td>40&quot;</td><td>42&quot;</td><td>46&quot;</td><td>40&quot;</td></tr>
                <tr style={{ borderBottom: '1px solid #EBEBEB' }}><td style={{ padding: '0.65rem 0.5rem', textAlign: 'left', fontWeight: 600 }}>L</td><td>42&quot;</td><td>44&quot;</td><td>48&quot;</td><td>40&quot;</td></tr>
                <tr style={{ borderBottom: '1px solid #EBEBEB' }}><td style={{ padding: '0.65rem 0.5rem', textAlign: 'left', fontWeight: 600 }}>XL</td><td>44&quot;</td><td>46&quot;</td><td>50&quot;</td><td>40&quot;</td></tr>
                <tr style={{ borderBottom: '1px solid #EBEBEB' }}><td style={{ padding: '0.65rem 0.5rem', textAlign: 'left', fontWeight: 600 }}>2XL</td><td>46&quot;</td><td>48&quot;</td><td>52&quot;</td><td>40&quot;</td></tr>
                <tr style={{ borderBottom: '1px solid #EBEBEB' }}><td style={{ padding: '0.65rem 0.5rem', textAlign: 'left', fontWeight: 600 }}>3XL</td><td>48&quot;</td><td>50&quot;</td><td>54&quot;</td><td>40&quot;</td></tr>
                <tr style={{ borderBottom: '1px solid #EBEBEB' }}><td style={{ padding: '0.65rem 0.5rem', textAlign: 'left', fontWeight: 600 }}>4XL</td><td>50&quot;</td><td>52&quot;</td><td>56&quot;</td><td>40&quot;</td></tr>
              </tbody>
            </table>

            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#FAF8F5', borderRadius: '4px', fontSize: '0.8rem', color: '#444444', lineHeight: 1.6 }}>
              <strong>Custom Fit Available:</strong> If your measurements fall between sizes or you would like custom sleeve/garment lengths, select <em>Custom Fit</em> and our atelier team will connect directly via WhatsApp at +91 8142595131.
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
