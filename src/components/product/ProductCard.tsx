'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/context/StoreContext';
import { averageRating, useReviews } from '@/lib/reviews';
import { useDominantColor } from '@/lib/dominantColor';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { formatPrice, addToCart, setQuickViewProduct } = useStore();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const { reviews: storeReviews } = useReviews();
  const cardReviews = [...storeReviews.filter((r) => r.productId === product.id), ...product.reviews];
  const rating = averageRating(cardReviews);

  const secondaryImage = product.images[1] || product.images[0];
  const imageBg = useDominantColor(product.images[0]);
  const isSoldOut = !product.inStock || product.stockCount <= 0;
  const discountPct =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  return (
    <div
      className="product-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: '100%',
        backgroundColor: '#FFFFFF'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3:4 portrait image box with a hairline black frame, tinted with a light wash of the photo's main colour */}
      <div
        className="product-card-media"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          overflow: 'hidden',
          borderRadius: 0,
          border: '0.4px solid #000000',
          backgroundColor: imageBg ? imageBg.replace('rgb(', 'rgba(').replace(')', ', 0.15)') : 'transparent',
          transition: 'background-color 0.3s ease'
        }}
      >
        <Link 
          href={`/product/${product.slug}`} 
          style={{ display: 'block', width: '100%', height: '100%' }}
          title={`Go to ${product.title}`}
        >
          {/* Primary image */}
          <img
            src={product.images[0]}
            alt={`${product.title}, designer lighter`}
            className="primary-img"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: isHovered ? 0 : 1,
              transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isHovered ? 'scale(1.02)' : 'scale(1)'
            }}
          />

          {isSoldOut && (
            <span className="product-card-badge is-soldout">Sold out</span>
          )}
          {!isSoldOut && discountPct >= 10 && (
            <span className="product-card-badge">{discountPct}% off</span>
          )}

          {/* Secondary hover image */}
          <img
            src={secondaryImage}
            alt={`${product.title}, designer lighter, alternate view`}
            className="hover-img"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isHovered ? 'scale(1.02)' : 'scale(1)'
            }}
          />
        </Link>

        {/* Add to Cart: round icon button (adds directly when only one size, otherwise opens quick view to pick a size) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (product.sizes.length === 1) {
              addToCart(product, product.sizes[0]);
            } else {
              setQuickViewProduct(product);
            }
          }}
          hidden={isSoldOut}
          aria-label={product.sizes.length === 1 ? `Add ${product.title} to cart` : `Choose a size for ${product.title}`}
          title={product.sizes.length === 1 ? 'Add to cart' : 'Choose size'}
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(17, 17, 17, 0.1)',
            display: isSoldOut ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Plus size={16} color="#111111" strokeWidth={2} />
        </button>
      </div>

      {/* Product Title and Price Info */}
      <div 
        style={{ 
 
          paddingTop: '1rem',
          paddingBottom: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          gap: '0.45rem'
        }}
      >
        <Link 
          href={`/product/${product.slug}`}
          style={{ textDecoration: 'none' }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: 0,
              textTransform: 'uppercase',
              color: '#111111',
              lineHeight: 1.5,
              margin: 0
            }}
          >
            {product.title}
          </h3>
        </Link>

        {cardReviews.length > 0 && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: '#000000' }}>
            <Star size={13} fill="#C08A2E" color="#C08A2E" />
            {rating.toFixed(1)} <span style={{ color: '#000000' }}>({cardReviews.length})</span>
          </span>
        )}

        {/* Regular Price */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.15rem 0.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: '16px',
              fontWeight: 400,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#111111'
            }}
          >
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span
              style={{
                fontFamily: 'var(--font-body-family)',
                fontSize: '0.82rem',
                color: '#000000',
                textDecoration: 'line-through'
              }}
            >
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
