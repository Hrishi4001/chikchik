'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/context/StoreContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { formatPrice, addToCart } = useStore();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const secondaryImage = product.images[1] || product.images[0];

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
      {/* 3:4 Aspect Ratio Image Box */}
      <div
        className="product-card-media"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          overflow: 'hidden',
          backgroundColor: '#F8F6F2'
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
            alt={product.title}
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

          {/* Secondary hover image */}
          <img
            src={secondaryImage}
            alt={`${product.title} view 2`}
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

        {/* Add to Cart: square icon button (adds directly when only one size, otherwise opens product page to pick a size) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (product.sizes.length === 1) {
              addToCart(product, product.sizes[0]);
            } else {
              router.push(`/product/${product.slug}`);
            }
          }}
          disabled={!product.inStock}
          aria-label={product.inStock ? `Add ${product.title} to cart` : 'Out of stock'}
          title={product.inStock ? 'Add to cart' : 'Out of stock'}
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#580F00',
            border: '1px solid #580F00',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15,
            cursor: product.inStock ? 'pointer' : 'not-allowed',
            opacity: product.inStock ? 1 : 0.5,
            transition: 'all 0.2s ease'
          }}
        >
          <Plus size={18} color="#FFFFFF" strokeWidth={1.8} />
        </button>
      </div>

      {/* Product Title and Price Info */}
      <div 
        style={{ 
          paddingTop: '0.9rem', 
          paddingBottom: '0.5rem',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.25rem' 
        }}
      >
        <Link 
          href={`/product/${product.slug}`}
          style={{ textDecoration: 'none' }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: '0.94rem',
              fontWeight: 400,
              color: '#580F00',
              lineHeight: 1.35,
              transition: 'color 0.2s ease',
              margin: 0
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#580F00')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#580F00')}
          >
            {product.title}
          </h3>
        </Link>

        {/* Regular Price */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.15rem 0.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: '0.88rem',
              fontWeight: 400,
              color: '#580F00'
            }}
          >
            Regular price {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span
              style={{
                fontFamily: 'var(--font-body-family)',
                fontSize: '0.82rem',
                color: '#8E8880',
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
