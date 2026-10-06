'use client';

import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import type { Review } from '@/lib/types';

// Email is stored for verification/contact only and never rendered publicly.
type StoreReview = Review & { email: string };

const STORAGE_KEY = 'svayam_reviews';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const MAX_COMMENT = 600;

const EMPTY_FORM = { author: '', email: '', rating: 0, title: '', comment: '' };

export default function ReviewsSection() {
  const { showToast } = useStore();
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setReviews(JSON.parse(saved));
    } catch {}
  }, []);

  const saveReviews = (next: StoreReview[]) => {
    setReviews(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const validate = () => {
    const next: typeof errors = {};
    const email = form.email.trim().toLowerCase();
    if (form.author.trim().length < 2) next.author = 'Please enter your name';
    if (!email) next.email = 'Email is required';
    else if (!EMAIL_RE.test(email)) next.email = 'Enter a valid email address (e.g. name@example.com)';
    else if (reviews.some((r) => r.email === email)) next.email = 'A review has already been submitted with this email';
    if (form.rating < 1) next.rating = 'Please select a rating';
    if (form.comment.trim().length < 10) next.comment = 'Review must be at least 10 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const review: StoreReview = {
      id: Math.random().toString(36).substring(2, 9),
      author: form.author.trim(),
      email: form.email.trim().toLowerCase(),
      rating: form.rating,
      title: form.title.trim(),
      comment: form.comment.trim(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      verifiedBuyer: false
    };
    saveReviews([review, ...reviews]);
    setForm(EMPTY_FORM);
    setErrors({});
    setIsFormOpen(false);
    showToast('Thank you! Your review has been posted.', 'success');
  };

  const update = (field: keyof typeof EMPTY_FORM, value: string | number) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const shownRating = hoverRating || form.rating;

  return (
    <section className="reviews-section">
      <div className="container">
        <div className="reviews-header">
          <p className="reviews-eyebrow">Reviews</p>
          <h2 className="reviews-heading">What Our Customers Say</h2>
          {reviews.length > 0 ? (
            <div className="reviews-summary">
              <Stars value={Math.round(average)} size={16} />
              <span>
                <strong>{average.toFixed(1)}</strong> out of 5 · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          ) : (
            <p className="reviews-sub">Be the first to share your Heva Elegance experience</p>
          )}
          {!isFormOpen && (
            <button type="button" className="reviews-cta" onClick={() => setIsFormOpen(true)}>
              Write a Review
            </button>
          )}
        </div>

        {isFormOpen && (
          <form className="review-form" onSubmit={handleSubmit} noValidate>
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
              <button type="submit" className="reviews-cta">Submit Review</button>
            </div>
          </form>
        )}

        {reviews.length > 0 && (
          <div className="reviews-list">
            {reviews.map((r) => (
              <article key={r.id} className="review-card">
                <Stars value={r.rating} size={14} />
                {r.title && <h3 className="review-card-title">{r.title}</h3>}
                <p className="review-card-comment">&ldquo;{r.comment}&rdquo;</p>
                <div className="review-card-meta">
                  <span className="review-card-author">{r.author}</span>
                  <span>{r.date}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Stars({ value, size }: { value: number; size: number }) {
  return (
    <span className="review-stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} fill={n <= value ? 'currentColor' : 'none'} />
      ))}
    </span>
  );
}
