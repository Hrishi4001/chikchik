'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, products, formatPrice } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  if (!isSearchOpen) return null;

  const filteredProducts = searchQuery.trim() === ''
    ? []
    : products.filter((p) => {
        const query = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(query) ||
          p.subtitle.toLowerCase().includes(query) ||
          p.fabric.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.craft.toLowerCase().includes(query) ||
          p.color.toLowerCase().includes(query)
        );
      });

  // Suggest only fabrics that are actually in the catalogue, most-stocked first
  const fabricCounts = products.reduce<Record<string, number>>((acc, p) => {
    if (p.fabric) acc[p.fabric] = (acc[p.fabric] || 0) + 1;
    return acc;
  }, {});
  const popularSearches = ['Saree', 'Kurti', ...Object.keys(fabricCounts).sort((a, b) => fabricCounts[b] - fabricCounts[a]).slice(0, 6)];

  // On a product page, recommend pieces like the one being viewed; elsewhere, bestsellers and new arrivals
  const currentSlug = pathname.startsWith('/product/') ? decodeURIComponent(pathname.split('/')[2] || '') : '';
  const current = products.find((p) => p.slug === currentSlug);
  const available = products.filter((p) => p.inStock && p.stockCount > 0 && p.id !== current?.id);
  const score = (p: (typeof products)[number]) =>
    current
      ? (p.category === current.category ? 4 : 0) + (p.fabric === current.fabric ? 2 : 0) + (Math.abs(p.price - current.price) <= current.price * 0.3 ? 1 : 0)
      : (p.isBestseller ? 2 : 0) + (p.isNewArrival ? 1 : 0);
  const recommended = [...available].sort((a, b) => score(b) - score(a)).slice(0, 6);
  const recommendedTitle = current ? 'Similar to this piece' : 'Recommended for you';

  const renderProduct = (product: (typeof products)[number]) => (
    <Link
      key={product.id}
      href={`/product/${product.slug}`}
      onClick={() => setIsSearchOpen(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '0.75rem',
        borderRadius: '6px',
        transition: 'background-color 0.2s ease'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <div
        style={{
          width: '60px',
          height: '80px',
          borderRadius: '4px',
          overflow: 'hidden',
          flexShrink: 0,
          backgroundColor: 'var(--bg-subtle)'
        }}
      >
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--accent-terracotta)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {product.categoryLabel}
        </span>
        <h4
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.05rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginTop: '0.15rem'
          }}
        >
          {product.title}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {product.fabric} • {product.origin}
        </p>
      </div>

      <div style={{ textAlign: 'right' }}>
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
          {formatPrice(product.price)}
        </span>
        <ArrowUpRight size={16} style={{ display: 'block', marginLeft: 'auto', color: 'var(--text-muted)', marginTop: '0.2rem' }} />
      </div>
    </Link>
  );

  const sectionLabel: React.CSSProperties = {
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '1rem'
  };

  const recommendations = recommended.length > 0 && (
    <div style={{ order: current ? -1 : 0, marginTop: current ? 0 : '1.75rem', marginBottom: current ? '1.75rem' : 0 }}>
      <p style={sectionLabel}>{recommendedTitle}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>{recommended.map(renderProduct)}</div>
    </div>
  );

  return (
    <div className="modal-backdrop" onClick={() => setIsSearchOpen(false)}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-modal)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          margin: '1.5rem',
          overflow: 'hidden',
          animation: 'slideInUp 0.25s var(--ease-luxury) forwards'
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: '#FAF8F5'
          }}
        >
          <Search size={22} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search sarees, kurtis, fabrics…"
            aria-label="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '1.05rem',
              minWidth: 0,
              color: 'var(--text-primary)',
              outline: 'none',
              fontFamily: 'var(--font-sans)'
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} aria-label="Clear search" style={{ color: 'var(--text-muted)', padding: '0.5rem', margin: '-0.5rem' }}>
              <X size={18} />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="search-close-btn"
            aria-label="Close search"
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.78rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '4px'
            }}
          >
            <span className="search-close-label">Esc</span>
            <X size={20} className="search-close-icon" />
          </button>
        </div>

        {/* Content Area */}
        <div style={{ overflowY: 'auto', padding: '1.5rem' }}>
          {searchQuery.trim() === '' ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={sectionLabel}>Popular searches</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.82rem',
                      color: 'var(--text-primary)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-sand)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                  >
                    <Sparkles size={12} color="var(--accent-gold)" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
              {recommendations}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    No creations found for &quot;{searchQuery}&quot;
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Try a fabric or colour, like &quot;{popularSearches[2] || 'silk'}&quot; or &quot;blue&quot;
                  </p>
                  <div style={{ textAlign: 'left' }}>{recommendations}</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {filteredProducts.map(renderProduct)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
