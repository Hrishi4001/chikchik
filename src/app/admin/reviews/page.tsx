'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge, PageHeader } from '@/components/admin/ui';
import { useStore } from '@/context/StoreContext';
import type { StoreReview } from '@/lib/reviews';
import styles from '../admin.module.css';

type AdminReview = StoreReview & { createdAt: string; hidden?: boolean };

export default function AdminReviewsPage() {
  const { showToast } = useStore();
  const [reviews, setReviews] = useState<AdminReview[] | null>(null);

  useEffect(() => {
    fetch('/api/admin/reviews', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { reviews: AdminReview[] }) => setReviews(data.reviews))
      .catch(() => {
        setReviews([]);
        showToast('Could not load reviews', 'error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = async (r: AdminReview) => {
    const res = await fetch(`/api/admin/reviews/${r.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hidden: !r.hidden })
    }).catch(() => null);
    if (!res?.ok) return showToast('Could not update review', 'error');
    setReviews((prev) => prev?.map((x) => (x.id === r.id ? { ...x, hidden: !r.hidden } : x)) ?? null);
    showToast(r.hidden ? 'Review published' : 'Review hidden from the store', 'info');
  };

  return (
    <>
      <PageHeader title="Reviews" subtitle={reviews ? `${reviews.length} reviews · ${reviews.filter((r) => !r.hidden).length} published` : 'Loading…'} />
      <section className={styles.card}>
        {reviews && reviews.length === 0 ? (
          <div className={styles.empty}>No reviews yet. Ask recent buyers to review their piece from the product page.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {reviews?.map((r) => (
                  <tr key={r.id}>
                    <td>{r.date}</td>
                    <td>
                      {r.author}
                      <div className={styles.muted}>{r.email}</div>
                    </td>
                    <td>{r.productSlug ? <Link href={`/product/${r.productSlug}`}>{r.productTitle}</Link> : 'Store'}</td>
                    <td>{'★'.repeat(r.rating)}</td>
                    <td style={{ maxWidth: 360 }}>
                      {r.title && <strong>{r.title}. </strong>}
                      {r.comment}
                    </td>
                    <td>
                      <Badge tone={r.hidden ? 'neutral' : 'good'}>{r.hidden ? 'Hidden' : r.verifiedBuyer ? 'Verified' : 'Published'}</Badge>
                    </td>
                    <td>
                      <button className={styles.btn} onClick={() => toggle(r)}>
                        {r.hidden ? 'Publish' : 'Hide'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
