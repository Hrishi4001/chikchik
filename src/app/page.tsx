'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/product/ProductCard';
import type { Product } from '@/lib/types';
import ReviewsSection from '@/components/home/ReviewsSection';
import FaqGroups from '@/components/faq/FaqGroups';

export default function HomePage() {
  const { products, formatPrice } = useStore();

  // Lead every rail with pieces that can actually be bought
  const available = (p: Product) => p.inStock && p.stockCount > 0;
  const byStock = [...products].sort((a, b) => Number(available(b)) - Number(available(a)));
  const fromPrice = (category: string) =>
    Math.min(...products.filter((p) => p.category === category && available(p)).map((p) => p.price));

  // Carousel 1: New Arrivals
  const carousel1Products = byStock.filter((p) => p.isNewArrival).concat(byStock.filter((p) => !p.isNewArrival)).slice(0, 12);

  // Carousel 2: Kurti Suits row
  const kurtiSuits = byStock.filter((p) => p.category === 'kurti-suits').slice(0, 12);

  // Carousel 3: Sarees row
  const sarees = byStock.filter((p) => p.category === 'sarees').slice(0, 12);

  // Bento: a large saree beside two smaller pieces, drawn from beyond the carousels.
  const pool = byStock.slice(20).filter((p) => p.images?.length);
  const bentoSarees = pool.filter((p) => p.category === 'sarees');
  const bentoOthers = pool.filter((p) => p.category !== 'sarees');
  const featuredProducts = [bentoSarees[0], bentoOthers[0] ?? bentoSarees[2], bentoSarees[1]].filter(Boolean) as Product[];

  const instagramPosts = products.filter((p) => p.images?.length).slice(0, 12);

  const categoryCards = [
    {
      title: 'Sarees',
      href: '/shop?category=sarees',
      image: 'https://static.wixstatic.com/media/80e345_55dd42dcf4734ed68704cf25097b1735~mv2.webp/v1/fill/w_800,h_1067,al_c,q_85/file.webp'
    },
    {
      title: 'Kurti Suits',
      href: '/shop?category=kurti-suits',
      image: 'https://static.wixstatic.com/media/80e345_a4f1adb0a4384b0c9b466dffa9d4724e~mv2.jpeg/v1/fill/w_800,h_1067,al_c,q_85/file.jpeg'
    }
  ];

  // Carousel 1 scroll ref
  const carousel1Ref = useRef<HTMLDivElement>(null);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.75;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, backgroundColor: '#FFFFFF' }}>
      
      {/* ========================================================
          SECTION 1: HERO BANNER (section-hero-banner)
          Full viewport height; copy sits on the soft left half on desktop
          ======================================================== */}
      <section 
        className="hero-section-full"
        style={{
          position: 'relative',
          height: 'calc(100vh - 40px)',
          minHeight: '640px',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Hero Image (right half on desktop, full width on mobile) */}
        <picture className="hero-picture">
          <img
            src="/images/hero-mobile.jpg"
            alt="Heva Elegance"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top'
            }}
          />
        </picture>

        {/* Bottom Content Alignment */}
        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 5,
            paddingBottom: '3.5rem',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1.25rem'
          }}
        >
          <div className="hero-copy">
            <p className="hero-eyebrow">Sarees &amp; Kurti Suits</p>
            <h1 className="hero-title">Everyday ease, festive grace.</h1>
            <p className="hero-sub">
              {Number.isFinite(fromPrice('sarees')) && <>Sarees from {formatPrice(fromPrice('sarees'))} · </>}
              {Number.isFinite(fromPrice('kurti-suits')) && <>Kurti suits from {formatPrice(fromPrice('kurti-suits'))} · </>}
              Free shipping above ₹699
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Link href="/shop?category=sarees" className="button--white-outlined hero-cta-solid">
                Shop Sarees
              </Link>
              <Link href="/shop?category=kurti-suits" className="button--white-outlined">
                Shop Kurti Suits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 1B: SHOP BY CATEGORY
          Two full-bleed image tiles linking to each category
          ======================================================== */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1rem',
          width: '100%',
          paddingTop: '1rem'
        }}
      >
        {categoryCards.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            aria-label={cat.title}
            className="category-tile"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              minHeight: '80vh',
              overflow: 'hidden',
              textDecoration: 'none'
            }}
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="category-tile-img"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            {/* Ambient Overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 55%, rgba(0, 0, 0, 0.5) 100%)',
                zIndex: 2
              }}
            />

            <div
              style={{
                position: 'relative',
                zIndex: 5,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.9rem',
                padding: '0 2rem 2.5rem'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-heading-family)',
                  fontSize: '1.15rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  fontWeight: 400
                }}
              >
                {cat.title}
              </span>
              <span
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#580F00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <ArrowRight size={16} color="#FFFFFF" strokeWidth={1.8} />
              </span>
            </div>
          </Link>
        ))}

        <style jsx>{`
          .category-tile :global(.category-tile-img) {
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .category-tile:hover :global(.category-tile-img) {
            transform: scale(1.03);
          }
        `}</style>
      </section>

      {/* ========================================================
          SECTION 2: FEATURED PRODUCTS CAROUSEL 1 (New Arrivals)
          ======================================================== */}
      <section
        style={{
          paddingTop: '3.5rem',
          paddingBottom: '3.5rem',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #EBEBEB'
        }}
      >
        <div className="container">
          {/* Section Header & Tab Controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                className="button button--filled"
                style={{
                  padding: '0.65rem 1.6rem',
                  fontSize: '0.75rem'
                }}
              >
                NEW ARRIVALS
              </button>
            </div>

            {/* Slider Navigation Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => scrollCarousel(carousel1Ref, 'left')}
                className="swiper-nav-btn"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollCarousel(carousel1Ref, 'right')}
                className="swiper-nav-btn"
                aria-label="Next Slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Horizontal Swiper Carousel Track */}
          <div 
            ref={carousel1Ref}
            className="swiper-track-custom"
          >
            {carousel1Products.map((product) => (
              <div 
                key={product.id} 
                className="swiper-slide-item"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Bottom View All Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
            <Link
              href="/shop"
              className="button button--outlined"
            >
              View all
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: FULL WIDTH BANNER 1 (Editorial Statement)
          Heva saree editorial + Quote + "Explore All Products"
          ======================================================== */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden'
        }}
      >
        <img
          src="https://static.wixstatic.com/media/80e345_c40e42c60e374f988924a441cea3315a~mv2.jpg/v1/fit/w_1920,h_2560,q_90/file.jpg"
          alt="Heva Elegance"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {/* Ambient Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.45) 100%)',
            zIndex: 2
          }}
        />

        {/* Editorial Text Content */}
        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 5,
            paddingBottom: '4rem',
            maxWidth: '1480px',
            width: '100%'
          }}
        >
          <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading-family)',
                fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)',
                fontWeight: 400,
                lineHeight: 1.25,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                margin: 0
              }}
            >
              Woven for the festivals you look forward to, and the everyday moments in between.
            </h2>

            <div>
              <Link
                href="/shop"
                className="button--white-outlined"
              >
                Explore All Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4: KURTI SUITS
          Swipeable product row (no auto-scroll)
          ======================================================== */}
      <section
        style={{
          paddingTop: '4rem',
          paddingBottom: '4rem',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #EBEBEB'
        }}
      >
        <div className="container">
          <h2
            style={{
              fontFamily: 'var(--font-heading-family)',
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
              fontWeight: 400,
              color: '#580F00',
              letterSpacing: '-0.02em',
              margin: '0 0 2rem'
            }}
          >
            Kurti Suits
          </h2>
        </div>

        <ProductRow products={kurtiSuits} />

        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
            <Link
              href="/shop?category=kurti-suits"
              className="button button--outlined"
            >
              View all
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4B: SAREES
          Swipeable product row (no auto-scroll)
          ======================================================== */}
      {sarees.length > 0 && (
      <section
        style={{
          paddingTop: '4rem',
          paddingBottom: '4rem',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #EBEBEB'
        }}
      >
        <div className="container">
          <h2
            style={{
              fontFamily: 'var(--font-heading-family)',
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
              fontWeight: 400,
              color: '#580F00',
              letterSpacing: '-0.02em',
              margin: '0 0 2rem'
            }}
          >
            Sarees
          </h2>
        </div>

        <ProductRow products={sarees} />

        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
            <Link
              href="/shop?category=sarees"
              className="button button--outlined"
            >
              View all
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ========================================================
          SECTION 5: FEATURED BENTO
          One large product left, two stacked on the right (all viewports)
          ======================================================== */}
      {featuredProducts.length === 3 && (
        <section style={{ paddingTop: '1rem', paddingBottom: '4rem', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <div className="feature-bento">
              {featuredProducts.map((p, i) => (
                <Link key={p.id} href={`/product/${p.slug}`} className={`feature-tile${i === 0 ? ' feature-tile--large' : ''}`}>
                  <img src={p.images[0]} alt={p.title} loading="lazy" />
                  <span className="feature-caption">
                    <span className="feature-title">{p.title}</span>
                    <span className="feature-price">{formatPrice(p.price)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 6: CUSTOMER REVIEWS */}
      <ReviewsSection />

      {/* ========================================================
          SECTION 7: TRUST INDICATORS (section-trust-indicators)
          Conscious craftsmanship, handloom origins & shipping
          ======================================================== */}
      <section
        style={{
          paddingTop: '2.5rem',
          paddingBottom: '2.5rem',
          backgroundColor: '#F7F5EF',
          borderBottom: '1px solid #EBEBEB'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <div>
              <p style={{ fontFamily: 'var(--font-button-family)', fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#580F00', fontWeight: 600, marginBottom: '0.35rem' }}>
                Quality Fabrics
              </p>
              <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '0.82rem', color: '#5C5852', margin: 0 }}>
                Silks, crepes and breathable cottons
              </p>
            </div>

            <div>
              <p style={{ fontFamily: 'var(--font-button-family)', fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#580F00', fontWeight: 600, marginBottom: '0.35rem' }}>
                Easy 7-Day Returns
              </p>
              <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '0.82rem', color: '#5C5852', margin: 0 }}>
                Hassle-free returns &amp; size exchanges
              </p>
            </div>

            <div>
              <p style={{ fontFamily: 'var(--font-button-family)', fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#580F00', fontWeight: 600, marginBottom: '0.35rem' }}>
                Free Shipping Above ₹699
              </p>
              <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '0.82rem', color: '#5C5852', margin: 0 }}>
                Insured delivery across India
              </p>
            </div>

            <div>
              <p style={{ fontFamily: 'var(--font-button-family)', fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#580F00', fontWeight: 600, marginBottom: '0.35rem' }}>
                Cash on Delivery
              </p>
              <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '0.82rem', color: '#5C5852', margin: 0 }}>
                Or pay securely with UPI &amp; cards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 8: INSTAGRAM (#HevaElegance)
          ======================================================== */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-button-family)', fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8E8880', marginBottom: '0.5rem' }}>
            Instagram
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 500, color: '#580F00', marginBottom: '0.5rem' }}>
            #HevaElegance
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#5C5852', margin: 0 }}>
            Tag us to be featured in our community of elegance
          </p>
        </div>
        <InstagramCarousel posts={instagramPosts} />
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="insta-follow">
            <InstagramIcon size={16} /> Follow @hevaelegance
          </a>
        </div>
      </section>

      {/* ========================================================
          SECTION 9: FAQ
          ======================================================== */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 500, color: '#580F00', textAlign: 'center', marginBottom: '2rem' }}>
            Frequently Asked Questions
          </h2>
          <FaqGroups />
        </div>
      </section>

    </div>
  );
}

const INSTAGRAM_URL = 'https://www.instagram.com/explore/tags/hevaelegance/';
const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/hevaelegance/';

function InstagramIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

// Product cards in a static row; swipe/scroll horizontally to see more.
function ProductRow({ products }: { products: Product[] }) {
  return (
    <div className="insta-viewport product-row">
      <div className="product-row-track">
        {products.map((p) => (
          <div key={p.id} className="product-row-item">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Continuous marquee; the list is doubled so the -50% loop point is seamless.
function InstagramCarousel({ posts }: { posts: Product[] }) {
  return (
    <div className="insta-viewport">
      <div className="insta-track" style={{ animationDuration: `${posts.length * 8}s` }}>
        {[...posts, ...posts].map((p, i) => (
          <a
            key={`${p.id}-${i}`}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="insta-tile"
            aria-label={`View ${p.title} on Instagram`}
            aria-hidden={i >= posts.length || undefined}
            tabIndex={i >= posts.length ? -1 : undefined}
          >
            <img src={p.images[0]} alt={p.title} loading="lazy" />
            <span className="insta-overlay">
              <InstagramIcon />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
