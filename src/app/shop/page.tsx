'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Filter, SlidersHorizontal, Grid3X3, Grid2X2, RotateCcw, ChevronRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/product/ProductCard';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const { products } = useStore();

  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [selectedFabric, setSelectedFabric] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [columns, setColumns] = useState<2 | 3 | 4>(3);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available fabrics
  const fabrics = ['all', 'Pure Tissue Organza', 'Pure Mulberry Raw Silk', 'Pure 100% Katan Mulberry Silk', 'Pure Silk Georgette'];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
        if (selectedFabric !== 'all' && !p.fabric.toLowerCase().includes(selectedFabric.toLowerCase().replace('pure ', ''))) return false;
        if (selectedPriceRange === 'under-1k' && p.price >= 1000) return false;
        if (selectedPriceRange === '1k-2k' && (p.price < 1000 || p.price > 2000)) return false;
        if (selectedPriceRange === 'above-2k' && p.price <= 2000) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [products, categoryFilter, selectedFabric, selectedPriceRange, sortBy]);

  const resetFilters = () => {
    setCategoryFilter('all');
    setSelectedFabric('all');
    setSelectedPriceRange('all');
    setSortBy('featured');
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Breadcrumb Navigation */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 500, textTransform: 'capitalize' }}>
          {categoryFilter === 'all' ? 'All Collections' : categoryFilter}
        </span>
      </nav>

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
          {[
            { id: 'all', label: 'All Silhouettes' },
            { id: 'sarees', label: 'Sarees' },
            { id: 'kurti-suits', label: 'Kurti Suits' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              style={{
                padding: '0.4rem 0.9rem',
                fontSize: '0.75rem',
                fontWeight: categoryFilter === tab.id ? 600 : 400,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderRadius: '4px',
                backgroundColor: categoryFilter === tab.id ? 'var(--bg-dark, #580F00)' : 'var(--bg-subtle)',
                color: categoryFilter === tab.id ? '#FFFFFF' : 'var(--text-primary)',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Tools: Sort, View Count & Grid Toggles */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem 1.25rem' }} className="shop-tools">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="mobile-filter-btn"
            aria-expanded={isMobileFilterOpen}
            style={{
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.8rem',
              fontSize: '0.78rem',
              borderRadius: '4px',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)'
            }}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredProducts.length}</strong> creations
          </span>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
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
              <option value="featured">Featured / Bestsellers</option>
              <option value="newest">New Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Patron Rating</option>
            </select>
          </div>

          {/* Column Toggle (Desktop) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="grid-toggles">
            <button
              onClick={() => setColumns(2)}
              aria-label="2-column editorial view"
              style={{
                padding: '0.35rem',
                borderRadius: '3px',
                color: columns === 2 ? 'var(--text-primary)' : 'var(--text-muted)',
                backgroundColor: columns === 2 ? 'var(--bg-subtle)' : 'transparent'
              }}
            >
              <Grid2X2 size={18} />
            </button>
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
              <Grid3X3 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '3rem' }} className="shop-grid-layout">
        {/* Sidebar Filters */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className={`shop-sidebar${isMobileFilterOpen ? ' is-open' : ''}`}>
          {/* Active filter count & reset */}
          {(categoryFilter !== 'all' || selectedFabric !== 'all' || selectedPriceRange !== 'all') && (
            <button
              onClick={resetFilters}
              className="reset-filters-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                color: 'var(--accent-terracotta, #580F00)',
                fontWeight: 600
              }}
            >
              <RotateCcw size={14} />
              <span>Reset All Filters</span>
            </button>
          )}

          {/* Price Range Filter */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>
              Price Band
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under-1k', label: 'Under ₹1,000' },
                { id: '1k-2k', label: '₹1,000 - ₹2,000' },
                { id: 'above-2k', label: 'Above ₹2,000' }
              ].map((opt) => (
                <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === opt.id}
                    onChange={() => setSelectedPriceRange(opt.id)}
                    style={{ accentColor: 'var(--accent-terracotta, #580F00)' }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fabric Weave Filter */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>
              Artisanal Fabric
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              {[
                { id: 'all', label: 'All Handloom Fabrics' },
                { id: 'silk', label: 'Silk' },
                { id: 'crepe', label: 'Crepe' },
                { id: 'cotton', label: 'Cotton' },
                { id: 'georgette', label: 'Georgette' }
              ].map((fab) => (
                <label key={fab.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="fabric"
                    checked={selectedFabric === fab.id}
                    onChange={() => setSelectedFabric(fab.id)}
                    style={{ accentColor: 'var(--accent-terracotta, #580F00)' }}
                  />
                  <span>{fab.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Craft Provenance Note */}
          <div className="tailoring-note" style={{ padding: '1.25rem', backgroundColor: '#F9F7F3', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>Bespoke Tailoring</p>
            <p>Every piece includes custom measurement assistance. Blouse tailoring is available on all sarees.</p>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main>
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                No creations match the selected criteria
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Try adjusting your price band or fabric selection.
              </p>
              <button onClick={resetFilters} className="btn-primary">
                View All Creations
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
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .shop-grid-layout {
            grid-template-columns: 1fr !important;
          }
          .shop-sidebar {
            display: none !important;
          }
          .shop-sidebar.is-open {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1.5rem !important;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-subtle);
          }
          .grid-toggles {
            display: none !important;
          }
          .mobile-filter-btn {
            display: flex !important;
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
          .shop-sidebar.is-open {
            grid-template-columns: 1fr 1fr;
          }
          .shop-sidebar.is-open .reset-filters-btn,
          .shop-sidebar.is-open .tailoring-note {
            grid-column: 1 / -1;
          }
          .shop-grid-layout {
            gap: 1.5rem !important;
          }
          .shop-tools {
            width: 100%;
            justify-content: space-between;
          }
          .product-items-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1.75rem 0.85rem !important;
          }
        }
        .mobile-filter-btn {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading Atelier Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
