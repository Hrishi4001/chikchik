'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import type { Product, Review } from '@/lib/types';
import { averageRating, type StoreReview } from '@/lib/reviews';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const MAX_COMMENT = 600;

const EMPTY_FORM = { author: '', email: '', rating: 0, title: '', comment: '' };

interface Props {
  product: Product;
  // Seeded catalogue reviews plus customer-submitted ones for this product.
  reviews: (Review | StoreReview)[];
  /** Resolves to an error message, or null once the review is posted. */
  onSubmit: (review: Omit<StoreReview, 'id' | 'date' | 'verifiedBuyer'>) => Promise<string | null>;
}

export default function ProductReviews({ product, reviews, onSubmit }: Props) {
  const { showToast } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({});

  const validate = () => {
    const next: typeof errors = {};
    const email = form.email.trim().toLowerCase();
    if (form.author.trim().length < 2) next.author = 'Please enter your name';
    if (!email) next.email = 'Email is required';
    else if (!EMAIL_RE.test(email)) next.email = 'Enter a valid email address (e.g. name@example.com)';
    if (form.rating < 1) next.rating = 'Please select a rating';
    if (form.comment.trim().length < 10) next.comment = 'Review must be at least 10 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || busy) return;
    setBusy(true);
    const error = await onSubmit({
      author: form.author.trim(),
      email: form.email.trim().toLowerCase(),
      rating: form.rating,
      title: form.title.trim(),
      comment: form.comment.trim(),
      productId: product.id,
      productSlug: product.slug,
      productTitle: product.title
    });
    setBusy(false);
    if (error) {
      showToast(error, 'error');
      return;
    }
    setForm(EMPTY_FORM);
    setErrors({});
    setIsFormOpen(false);
    showToast('Thank you! Your review has been posted.', 'success');
  };

  const update = (field: keyof typeof EMPTY_FORM, value: string | number) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const average = averageRating(reviews);
  const shownRating = hoverRating || form.rating;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {reviews.length > 0 ? (
          <>
            <Stars value={Math.round(average)} size={15} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{average.toFixed(1)} out of 5</span>
            <span style={{ color: '#888888', fontSize: '0.8rem' }}>
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </>
        ) : (
          <span style={{ color: '#5C5852', fontSize: '0.85rem' }}>No reviews yet. Be the first to review this piece.</span>
        )}
      </div>

      {!isFormOpen && (
        <button type="button" className="reviews-cta" onClick={() => setIsFormOpen(true)} style={{ marginBottom: '1rem' }}>
          Write a Review
        </button>
      )}

      {isFormOpen && (
        <form className="review-form" onSubmit={handleSubmit} noValidate style={{ margin: '0 0 1.5rem' }}>
          <div className="review-field">
            <span className="review-label">Your Rating *</span>
            <div className="review-stars-input" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  aria-pressed={form.rating === n}
                  onMouseEnter={() => setHoverRating(n)}
                  onClick={() => update('rating', n)}
                >
                  <Star size={24} fill={n <= shownRating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            {errors.rating && <span className="review-error">{errors.rating}</span>}
          </div>

          <div className="review-row">
            <label className="review-field">
              <span className="review-label">Name *</span>
              <input
                type="text"
                value={form.author}
                onChange={(e) => update('author', e.target.value)}
                autoComplete="name"
                maxLength={60}
                aria-invalid={!!errors.author}
              />
              {errors.author && <span className="review-error">{errors.author}</span>}
            </label>
            <label className="review-field">
              <span className="review-label">Email * <em>(not published)</em></span>
              <input
                type="email"
                inputMode="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                autoComplete="email"
                maxLength={120}
                aria-invalid={!!errors.email}
              />
              {errors.email && <span className="review-error">{errors.email}</span>}
            </label>
          </div>

          <label className="review-field">
            <span className="review-label">Review Title</span>
            <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} maxLength={80} />
          </label>

          <label className="review-field">
            <span className="review-label">Your Review *</span>
            <textarea
              rows={4}
              value={form.comment}
              onChange={(e) => update('comment', e.target.value)}
              maxLength={MAX_COMMENT}
              aria-invalid={!!errors.comment}
            />
            <span className="review-count">{form.comment.length}/{MAX_COMMENT}</span>
            {errors.comment && <span className="review-error">{errors.comment}</span>}
          </label>

          <div className="review-actions">
            <button
              type="button"
              className="review-cancel"
              onClick={() => {
                setIsFormOpen(false);
                setErrors({});
              }}
            >
              Cancel
            </button>
            <button type="submit" className="reviews-cta" disabled={busy}>{busy ? 'Posting…' : 'Submit Review'}</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.map((rev) => (
          <div key={rev.id} style={{ padding: '0.85rem 0', borderTop: '1px solid #F0F0F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#777777', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 600, color: '#580F00' }}>
                {rev.author}
                {rev.verifiedBuyer && <span style={{ marginLeft: '0.4rem', fontWeight: 500, color: '#1B4435' }}>✓ Verified buyer</span>}
              </span>
              <span>{rev.date}</span>
            </div>
            <Stars value={rev.rating} size={12} />
            {rev.title && <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0.2rem 0' }}>{rev.title}</h4>}
            <p style={{ fontSize: '0.85rem', color: '#444444', lineHeight: 1.5 }}>&ldquo;{rev.comment}&rdquo;</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Stars({ value, size }: { value: number; size: number }) {
  return (
    <span className="review-stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} fill={n <= value ? 'currentColor' : 'none'} />
      ))}
    </span>
  );
}
