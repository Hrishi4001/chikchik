'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Review } from './types';

// Email is stored for verification/contact only and never rendered publicly.
export type StoreReview = Review & {
  email: string;
  productId?: string;
  productSlug?: string;
  productTitle?: string;
};

const STORAGE_KEY = 'svayam_reviews';
const CHANGE_EVENT = 'svayam-reviews-change';

function read(): StoreReview[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Shared across every mounted component (and other tabs) so a review posted on a
// product page shows up in the home page summary without a reload.
export function useReviews() {
  const [reviews, setReviews] = useState<StoreReview[]>([]);

  useEffect(() => {
    const sync = () => setReviews(read());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const addReview = useCallback((review: StoreReview) => {
    const next = [review, ...read()];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setReviews(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { reviews, addReview };
}

export function averageRating(reviews: { rating: number }[]) {
  return reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
}
