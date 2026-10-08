'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Review } from './types';

// Email is stored server-side for verification/contact only; the public API never returns it.
export type StoreReview = Review & {
  email?: string;
  productId?: string;
  productSlug?: string;
  productTitle?: string;
};

const CHANGE_EVENT = 'svayam-reviews-change';

let cache: StoreReview[] | null = null;
let inflight: Promise<StoreReview[]> | null = null;

function load(force = false): Promise<StoreReview[]> {
  if (cache && !force) return Promise.resolve(cache);
  if (!inflight || force) {
    inflight = fetch('/api/reviews', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { reviews: [] }))
      .then((data: { reviews: StoreReview[] }) => (cache = data.reviews))
      .catch(() => cache ?? [])
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

// Reviews live on the server so every shopper sees them; one fetch is shared by all mounted components.
export function useReviews() {
  const [reviews, setReviews] = useState<StoreReview[]>(cache ?? []);

  useEffect(() => {
    const sync = () => load().then(setReviews);
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    return () => window.removeEventListener(CHANGE_EVENT, sync);
  }, []);

  /** Posts a review; resolves to an error message, or null on success. */
  const addReview = useCallback(async (review: Omit<StoreReview, 'id' | 'date' | 'verifiedBuyer'>): Promise<string | null> => {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    if (!res?.ok) return data?.error || 'Could not post your review. Please try again.';
    cache = [data.review, ...(cache ?? [])];
    setReviews(cache);
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return null;
  }, []);

  return { reviews, addReview };
}

export function averageRating(reviews: { rating: number }[]) {
  return reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
}
