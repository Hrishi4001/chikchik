'use client';

import React from 'react';
import Link from 'next/link';
import { averageRating, useReviews } from '@/lib/reviews';
import { Stars } from '@/components/product/ProductReviews';

/** Recent customer reviews; hidden until there are real ones, since an empty block hurts trust more than none. */
export default function ReviewsSection() {
  const { reviews } = useReviews();
  if (reviews.length === 0) return null;

  const average = averageRating(reviews);

  return (
    <section className="reviews-section">
      <div className="container">
        <div className="reviews-header">
          <p className="reviews-eyebrow">Reviews</p>
          <h2 className="reviews-heading">What Our Customers Say</h2>
          <div className="reviews-summary">
            <Stars value={Math.round(average)} size={16} />
            <span>
              <strong>{average.toFixed(1)}</strong> out of 5 · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>

        <div className="reviews-list">
          {reviews.slice(0, 6).map((r) => (
            <article key={r.id} className="review-card">
              <Stars value={r.rating} size={14} />
              {r.title && <h3 className="review-card-title">{r.title}</h3>}
              <p className="review-card-comment">&ldquo;{r.comment}&rdquo;</p>
              <div className="review-card-meta">
                <span className="review-card-author">
                  {r.author}
                  {r.verifiedBuyer && <span style={{ marginLeft: '0.4rem', color: '#1B4435', fontWeight: 500 }}>✓ Verified buyer</span>}
                </span>
                <span>{r.date}</span>
              </div>
              {r.productSlug && r.productTitle && (
                <Link href={`/product/${r.productSlug}`} style={{ fontSize: '0.75rem', textDecoration: 'underline', color: 'var(--text-secondary)' }}>
                  {r.productTitle}
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
