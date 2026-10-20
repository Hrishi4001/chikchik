'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Grid3X3, Grid2X2, ChevronRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/product/ProductCard';
import { SHOP_COLLECTIONS, getCollection } from '@/lib/collections';

type SortKey = 'featured' | 'price-low' | 'price-high' | 'newest';

const CATEGORIES = SHOP_COLLECTIONS;

const PAGE_SIZE = 24;

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { products } = useStore();

  // Category and sort live in the URL so they survive back/forward, refresh and sharing
  const categoryFilter = searchParams.get('category') || 'all';
  const sortBy = (searchParams.get('sort') || 'featured') as SortKey;

  const setParam = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value === fallback) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const setCategoryFilter = (v: string) => setParam('category', v, 'all');
  const setSortBy = (v: SortKey) => setParam('sort', v, 'featured');

  const [columns, setColumns] = useState<3 | 4>(4);
  // Paging restarts whenever the category or sort change
  const filterKey = searchParams.toString();
  const [paging, setPaging] = useState({ key: filterKey, count: PAGE_SIZE });
  const visibleCount = paging.key === filterKey ? paging.count : PAGE_SIZE;

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        return categoryFilter === 'all' || p.category === categoryFilter;
      })
      .sort((a, b) => {
        // Sold-out pieces always sink below available ones
        const stock = Number(b.inStock && b.stockCount > 0) - Number(a.inStock && a.stockCount > 0);
        if (stock) return stock;
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0) || (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      });
  }, [products, categoryFilter, sortBy]);

  const collection = getCollection(categoryFilter);
  const categoryLabel = collection.label;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Breadcrumb Navigation */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
          {categoryFilter === 'all' ? 'All Collections' : categoryLabel}
        </span>
      </nav>

      {/* Collection heading and intro: the page's H1 and copy for search */}
      <header className="shop-intro">
        <h1>{collection.heading}</h1>
        <p>{collection.intro}</p>
      </header>

      {/* Filter & Toolbar Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 0',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '2.5rem'
        }}
      >
        {/* Category Quick Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }} className="category-pills">
          {CATEGORIES.map((tab) => (
            <button
              key={tab.id}
              aria-pressed={categoryFilter === tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              style={{
                padding: '0.4rem 0.9rem',
                fontSize: '0.75rem',
                fontWeight: categoryFilter === tab.id ? 600 : 400,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderRadius: '4px',
                backgroundColor: categoryFilter === tab.id ? 'var(--color-accent)' : 'var(--bg-subtle)',
                color: categoryFilter === tab.id ? '#111111' : 'var(--text-primary)',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Tools: Sort, View Count & Grid Toggles */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem 1.25rem' }} className="shop-tools">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
          </span>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              aria-label="Sort products"
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.78rem',
                borderRadius: '4px',
                border: '1px solid var(--border-medium)',
                backgroundColor: '#FFFFFF',
                color: 'var(--text-primary)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="featured">Featured</option>
              <option value="newest">New Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Column Toggle (Desktop) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="grid-toggles">
            <button
              onClick={() => setColumns(3)}
              aria-label="3-column view"
              style={{
                padding: '0.35rem',
                borderRadius: '3px',
                color: columns === 3 ? 'var(--text-primary)' : 'var(--text-muted)',
                backgroundColor: columns === 3 ? 'var(--bg-subtle)' : 'transparent'
              }}
            >
              <Grid2X2 size={18} />
            </button>
            <button
              onClick={() => setColumns(4)}
              aria-label="4-column view"
              style={{
                padding: '0.35rem',
                borderRadius: '3px',
                color: columns === 4 ? 'var(--text-primary)' : 'var(--text-muted)',
                backgroundColor: columns === 4 ? 'var(--bg-subtle)' : 'transparent'
              }}
            >
              <Grid3X3 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <main>
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
              No products here yet
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              New designs are on the way.
            </p>
            <button onClick={() => setCategoryFilter('all')} className="btn-primary">
              See all products
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: '2.5rem 1.75rem'
            }}
            className="product-items-grid"
          >
            {filteredProducts.slice(0, visibleCount).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
        {filteredProducts.length > visibleCount && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Showing {visibleCount} of {filteredProducts.length}
            </p>
            <button className="btn-secondary" onClick={() => setPaging({ key: filterKey, count: visibleCount + PAGE_SIZE })}>
              Load more
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
        @media (max-width: 900px) {
          .grid-toggles {
            display: none !important;
          }
          .product-items-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important;
          }
        }
        @media (max-width: 600px) {
          .category-pills {
            flex-wrap: nowrap !important;
            overflow-x: auto;
            width: 100%;
            scrollbar-width: none;
          }
          .category-pills::-webkit-scrollbar {
            display: none;
          }
          .category-pills button {
            flex-shrink: 0;
            white-space: nowrap;
          }
          .shop-tools {
            width: 100%;
            justify-content: space-between;
          }
          .shop-tools select {
            min-height: 40px;
          }
          .product-items-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1.75rem 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function ShopClient() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading…</div>}>
      <ShopContent />
    </Suspense>
  );
}
