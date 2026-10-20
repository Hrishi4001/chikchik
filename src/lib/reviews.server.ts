import { randomBytes } from 'node:crypto';
import { kvList, kvSet } from './kv.server';
import { listOrders } from './orders.server';
import { getProduct } from './products.server';
import type { StoreReview } from './reviews';

const STORE = 'reviews';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export class ReviewError extends Error {}

export async function listReviews() {
  return (await kvList<StoreReview & { createdAt: string; hidden?: boolean }>(STORE)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Public shape: never expose the reviewer's email. */
export function publicReview(review: StoreReview) {
  const { email, ...rest } = review;
  void email;
  return rest;
}

export async function addReview(input: Partial<StoreReview>) {
  const author = String(input.author ?? '').trim().slice(0, 60);
  const email = String(input.email ?? '').trim().toLowerCase().slice(0, 120);
  const rating = Math.round(Number(input.rating));
  const title = String(input.title ?? '').trim().slice(0, 100);
  const comment = String(input.comment ?? '').trim().slice(0, 600);
  const product = input.productId ? ((await getProduct(input.productId)) ?? undefined) : undefined;

  if (author.length < 2) throw new ReviewError('Please enter your name');
  if (!EMAIL_RE.test(email)) throw new ReviewError('Enter a valid email address');
  if (!(rating >= 1 && rating <= 5)) throw new ReviewError('Please select a rating');
  if (comment.length < 10) throw new ReviewError('Review must be at least 10 characters');
  if (input.productId && !product) throw new ReviewError('Product not found');

  const existing = await listReviews();
  if (existing.some((r) => r.email === email && (r.productId ?? '') === (product?.id ?? ''))) {
    throw new ReviewError(product ? 'You have already reviewed this product' : 'A review has already been submitted with this email');
  }

  // "Verified buyer" only when a real, non-cancelled order with this email contains the product
  const verifiedBuyer = (await listOrders()).some(
    (o) =>
      o.customerEmail?.toLowerCase() === email &&
      o.fulfillmentStatus !== 'Cancelled' &&
      (o.paymentStatus === 'Paid' || o.paymentMethod === 'COD') &&
      (!product || o.items.some((i) => i.productId === product.id))
  );

  const review: StoreReview & { createdAt: string } = {
    id: randomBytes(6).toString('hex'),
    author,
    email,
    rating,
    title,
    comment,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    verifiedBuyer,
    productId: product?.id,
    productSlug: product?.slug,
    productTitle: product?.title,
    createdAt: new Date().toISOString()
  };
  await kvSet(STORE, review.id, review);
  return review;
}

export async function setReviewHidden(id: string, hidden: boolean) {
  const review = (await listReviews()).find((r) => r.id === id);
  if (!review) return null;
  const updated = { ...review, hidden };
  await kvSet(STORE, id, updated);
  return updated;
}
