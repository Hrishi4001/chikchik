'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/product/ProductCard';
import type { Product } from '@/lib/types';
import { FAQ_GROUPS } from '@/lib/faq';
import { LEGAL } from '@/lib/legal';

// Width and height are the source pixels, so each label keeps its own shape in the gallery
const LABEL_ART = [
  { src: '/images/labels/eyes.jpg', w: 500, h: 345, title: 'Special Quality', alt: 'Special Quality Safety Match label with kohl-lined eyes' },
  { src: '/images/labels/king.jpg', w: 451, h: 640, title: 'King Delux', alt: 'King Match Delux Quality label' },
  { src: '/images/labels/husn-ki-teeli.jpg', w: 736, h: 1308, title: 'Husn ki Teeli', alt: 'Husn ki Teeli safety matches label' },
  { src: '/images/labels/kolhapuri.jpg', w: 736, h: 981, title: 'Kolhapuri', alt: 'Kolhapuri chappal matchbox-style poster' },
  { src: '/images/labels/bollywood-queen.jpg', w: 735, h: 919, title: 'Bollywood Queen', alt: 'Bollywood Queen matchbox-style poster' },
  { src: '/images/labels/tiger.jpg', w: 736, h: 1104, title: 'Tiger', alt: 'Tiger trade mark matchbox label' }
];

// One editorial banner + product rail per category, in this order
const CATEGORY_BANNERS = [
  {
    id: '90s-nostalgia',
    eyebrow: 'The',
    title: "90's Nostalgia",
    images: ['/images/labels/husn-ki-teeli.jpg', '/images/labels/bollywood-queen.jpg', '/images/labels/eyes.jpg']
  },
  {
    id: 'rogg',
    eyebrow: 'The',
    title: 'Rogg',
    images: ['/images/labels/tiger.jpg', '/images/labels/king.jpg', '/images/labels/kolhapuri.jpg']
  }
];

const MARQUEE_ITEMS = ['Solid metal build', 'Gift-ready packaging', `Free shipping above ₹${LEGAL.freeShippingThreshold}`, 'Secure payments'];

const SHOP_LINKS = [
  { label: 'All Lighters', href: '/shop' },
  { label: "90's Nostalgia", href: '/shop?category=90s-nostalgia' },
  { label: 'Rogg', href: '/shop?category=rogg' }
];

export default function HomePage() {
  const { products } = useStore();

  // Lead every rail with pieces that can actually be bought
  const available = (p: Product) => p.inStock && p.stockCount > 0;
  const byStock = [...products].sort((a, b) => Number(available(b)) - Number(available(a)));
  const freshReleases = byStock.filter((p) => p.isNewArrival).concat(byStock.filter((p) => !p.isNewArrival)).slice(0, 12);

  const productFaqs = FAQ_GROUPS.find((g) => g.heading === 'Products & Gifting')?.items.slice(0, 3) ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, backgroundColor: '#FFFFFF' }}>

      {/* 1. HERO: full-bleed artwork with a pill CTA */}
      <section className="hero-section-full">
        <picture className="hero-picture">
          <source media="(max-width: 749px)" srcSet="/images/labels/tiger.jpg" width={736} height={1104} />
          <img
            src="/images/labels/eyes.jpg"
            alt="Vintage Special Quality Safety Match label with kohl-lined eyes"
            width={500}
            height={345}
          />
        </picture>

        <div className="container hero-content">
          <div className="hero-copy">
            <h1 className="hero-title">Light it up like it’s 1995.</h1>
            <Link href="/shop" className="home-pill">Shop the collection.</Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURED TEXT + SLIDESHOW: matchbox label art */}
      <section className="label-gallery-section">
        <div className="container">
          <div className="label-gallery-head">
            <h2 className="label-gallery-title">Matchbox Label Art</h2>
            <p className="label-gallery-sub">The kirana-shop labels we collected as kids, and the designs they became.</p>
          </div>
        </div>
        <LabelSlideshow />
      </section>

      {/* 3. FEATURED TEXT + COLLECTION RAIL: fresh releases */}
      <ProductRail title="Fresh Releases" products={freshReleases} />

      {/* 4. CATEGORY BANNER + RAIL, once per category */}
      {CATEGORY_BANNERS.map((cat) => {
        const items = byStock.filter((p) => p.category === cat.id);
        return (
          <React.Fragment key={cat.id}>
            <CategoryBanner href={`/shop?category=${cat.id}`} eyebrow={cat.eyebrow} title={cat.title} images={cat.images} />
            {items.length > 0 && <ProductRail products={items} centered />}
          </React.Fragment>
        );
      })}

      {/* 5. FEATURED TEXT: brand one-liner */}
      <section className="home-statement">
        <div className="container">
          <h2>The kitsch. The classic. The not boring. That’s who we are.</h2>
          <Link href="/pages/about-us">And more &gt;&gt;&gt;</Link>
        </div>
      </section>

      {/* 6. IMAGE WITH TEXT: label collage beside the brand statement */}
      <section className="story-section">
        <div className="container story-layout">
          <div className="story-collage" aria-hidden="true">
            <img className="story-card story-card--back" src="/images/labels/king.jpg" alt="" width={451} height={640} loading="lazy" />
            <img className="story-card story-card--front" src="/images/labels/husn-ki-teeli.jpg" alt="" width={736} height={1308} loading="lazy" />
            <span className="story-stamp">Est. 1995<br />in spirit</span>
          </div>

          <div className="story-copy">
            <p className="story-eyebrow">Made to be kept</p>
            <h2 className="story-title">Built like the 90s.</h2>
            <p className="story-body">
              Solid metal, honest mechanics and finishes you&rsquo;ll want to show off. Like a favourite mixtape, every design is meant to be kept, passed around and talked about.
            </p>
            <ul className="story-chips">
              <li>Solid metal body</li>
              <li>Flip-top click</li>
              <li>Gift-boxed</li>
            </ul>
            <Link href="/shop" className="story-cta">
              Press play on the range <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. SCROLLING CONTENT: promise marquee */}
      <div className="home-marquee" aria-label={MARQUEE_ITEMS.join(', ')}>
        <div className="home-marquee-track" aria-hidden="true">
          {[0, 1, 2, 3].map((n) =>
            MARQUEE_ITEMS.map((item) => (
              <span key={`${n}-${item}`}>
                {item}
                <i>✦</i>
              </span>
            ))
          )}
        </div>
      </div>

      {/* 8. FEATURED TEXT x2: brand paragraphs on a dark band */}
      <section className="home-manifesto">
        <div className="container">
          <p>
            We take fire seriously and everything else lightly. Our lighters are loud and nostalgic, kitsch and collectible, each one wearing a label from the kirana-shop matchboxes we grew up with. Flick it. Gift it. Show it off. Keep it forever.
          </p>
        </div>
        <div className="container">
          <p>
            Chikchik is a design house that turns India&rsquo;s vintage matchbox art into solid metal lighters. We believe the small things you carry every day should say something about you, so every piece pairs a proper mechanism with artwork worth talking about.
          </p>
        </div>
      </section>

      {/* 9. COLLAPSIBLE ROWS: FAQ */}
      <section className="home-faq">
        <div className="container">
          <h2>All your questions. Here.</h2>
          <div className="home-faq-list">
            {productFaqs.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <div className="policy-body" style={{ paddingBottom: '1rem' }}>
                  <p>{f.a}</p>
                </div>
              </details>
            ))}
            <Link href="/pages/faq" className="home-faq-more">See all FAQs &gt;&gt;&gt;</Link>
          </div>
        </div>
      </section>

      {/* 10. SEO BLOCK: read more + shop links */}
      <SeoBlock />

    </div>
  );
}

function scrollTrack(ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') {
  if (!ref.current) return;
  const amount = ref.current.clientWidth * 0.75;
  ref.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
}

function LabelSlideshow() {
  const ref = useRef<HTMLDivElement>(null);

  // On phones each label keeps its own height, so size the track to the slide in view (no empty space below shorter labels)
  useEffect(() => {
    const track = ref.current;
    if (!track) return;
    const mobile = window.matchMedia('(max-width: 749px)');
    const fit = () => {
      if (!mobile.matches) {
        track.style.height = '';
        return;
      }
      const slide = track.children[Math.round(track.scrollLeft / track.clientWidth)] as HTMLElement | undefined;
      if (slide) track.style.height = `${slide.offsetHeight}px`;
    };
    fit();
    track.addEventListener('scroll', fit, { passive: true });
    window.addEventListener('resize', fit);
    track.querySelectorAll('img').forEach((img) => img.addEventListener('load', fit));
    return () => {
      track.removeEventListener('scroll', fit);
      window.removeEventListener('resize', fit);
      track.querySelectorAll('img').forEach((img) => img.removeEventListener('load', fit));
    };
  }, []);

  return (
    <div className="label-slideshow">
      <div ref={ref} className="label-slideshow-track">
        {LABEL_ART.map((art) => (
          <figure key={art.src} className="label-slide">
            <img src={art.src} alt={art.alt} width={art.w} height={art.h} loading="lazy" />
            <figcaption>{art.title}</figcaption>
          </figure>
        ))}
      </div>
      <button className="label-slideshow-btn is-prev" onClick={() => scrollTrack(ref, 'left')} aria-label="Previous label">
        <ChevronLeft size={18} />
      </button>
      <button className="label-slideshow-btn is-next" onClick={() => scrollTrack(ref, 'right')} aria-label="Next label">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function ProductRail({ title, products, centered }: { title?: string; products: Product[]; centered?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <section className={`home-rail${centered ? ' is-centered' : ''}`}>
      <div className="container">
        {title && (
          <div className="home-rail-head">
            <h2 className="home-rail-title">{title}</h2>
            <div className="home-rail-nav">
              <button onClick={() => scrollTrack(ref, 'left')} className="swiper-nav-btn" aria-label="Previous products">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => scrollTrack(ref, 'right')} className="swiper-nav-btn" aria-label="Next products">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
        <div ref={ref} className="swiper-track-custom">
          {products.map((product) => (
            <div key={product.id} className="swiper-slide-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryBanner({ href, eyebrow, title, images }: { href: string; eyebrow: string; title: string; images: string[] }) {
  return (
    <section className="cat-banner">
      <Link href={href} className="cat-banner-frame" aria-label={`Shop ${title}`}>
        <span className="cat-banner-images">
          {images.map((src) => (
            <img key={src} src={src} alt="" loading="lazy" />
          ))}
        </span>
        <span className="cat-banner-title">
          <small>{eyebrow}</small>
          {title}
        </span>
        <span className="home-pill">Shop now</span>
      </Link>
    </section>
  );
}

function SeoBlock() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="home-seo">
      <div className="container">
        <div className="home-seo-box">
          <div className="home-seo-about">
            <h2>Matchbox Art Lighters &amp; Gifts — Chikchik</h2>
            {expanded && (
              <p>
                Chikchik makes solid metal jet-flame and flip-top lighters printed with vintage Indian matchbox label art, from Husn ki Teeli to King Delux and Tiger. Every lighter ships gift-boxed across India, with free shipping above ₹{LEGAL.freeShippingThreshold}.
              </p>
            )}
            <button type="button" onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Read less' : 'Read more...'}
            </button>
          </div>
          <div className="home-seo-links">
            <p className="home-seo-label">Shop by category</p>
            <ul>
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
