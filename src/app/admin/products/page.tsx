'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Minus, Pencil, Trash2, Download } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Badge, PageHeader } from '@/components/admin/ui';
import { downloadCsv, inr, isSale, LOW_STOCK_THRESHOLD } from '@/lib/admin';
import styles from '../admin.module.css';

type StockFilter = 'all' | 'low' | 'out';

export default function AdminProductsPage() {
  const { products, orders, updateProduct, deleteProduct } = useStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const categories = useMemo(() => [...new Map(products.map((p) => [p.category, p.categoryLabel])).entries()], [products]);

  const unitsSold = useMemo(() => {
    const map = new Map<string, number>();
    orders.filter(isSale).forEach((o) => o.items.forEach((i) => map.set(i.productId, (map.get(i.productId) || 0) + i.quantity)));
    return map;
  }, [orders]);

  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase();
    if (q && ![p.title, p.fabric, p.origin, p.color].some((v) => v?.toLowerCase().includes(q))) return false;
    if (category !== 'all' && p.category !== category) return false;
    if (stockFilter === 'low' && !(p.stockCount > 0 && p.stockCount <= LOW_STOCK_THRESHOLD)) return false;
    if (stockFilter === 'out' && p.stockCount > 0) return false;
    return true;
  });

  const setStock = (id: string, count: number) => {
    const stockCount = Math.max(0, count);
    updateProduct(id, { stockCount, inStock: stockCount > 0 }, { silent: true });
  };

  const exportCsv = () =>
    downloadCsv(`products-${new Date().toISOString().slice(0, 10)}.csv`, [
      ['ID', 'Title', 'Category', 'Price', 'Compare at', 'Stock', 'Units sold', 'Fabric', 'Origin'],
      ...filtered.map((p) => [p.id, p.title, p.categoryLabel, p.price, p.compareAtPrice || '', p.stockCount, unitsSold.get(p.id) || 0, p.fabric, p.origin])
    ]);

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={`${filtered.length} of ${products.length} products`}
        actions={
          <>
            <button className={styles.btn} onClick={exportCsv}>
              <Download size={15} /> Export CSV
            </button>
            <Link href="/admin/products/new" className={styles.btnPrimary}>
              <Plus size={15} /> Add product
            </Link>
          </>
        }
      />

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <Search size={15} color="#8e8880" />
          <input placeholder="Search title, fabric, origin, colour" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search products" />
        </label>
        <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          <option value="all">All categories</option>
          {categories.map(([c, label]) => (
            <option key={c} value={c}>
              {label}
            </option>
          ))}
        </select>
        <select className={styles.select} value={stockFilter} onChange={(e) => setStockFilter(e.target.value as StockFilter)} aria-label="Stock">
          <option value="all">All stock levels</option>
          <option value="low">Low stock (≤{LOW_STOCK_THRESHOLD})</option>
          <option value="out">Out of stock</option>
        </select>
      </div>

      <section className={styles.card}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>No products match these filters</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th className={styles.num}>Price</th>
                  <th>Stock</th>
                  <th className={styles.num}>Sold</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/admin/products/${p.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={p.images[0]} alt="" className={styles.thumb} />
                        <span>
                          <strong>{p.title}</strong>
                          <div className={styles.muted}>{[p.fabric, p.color].filter(Boolean).join(' · ')}</div>
                        </span>
                      </Link>
                    </td>
                    <td>{p.categoryLabel}</td>
                    <td className={styles.num}>
                      {inr(p.price)}
                      {p.compareAtPrice && p.compareAtPrice > p.price && (
                        <div className={styles.muted} style={{ textDecoration: 'line-through' }}>
                          {inr(p.compareAtPrice)}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <button className={styles.iconBtn} aria-label={`Decrease stock for ${p.title}`} onClick={() => setStock(p.id, p.stockCount - 1)} disabled={p.stockCount === 0}>
                          <Minus size={14} />
                        </button>
                        <input
                          className={styles.input}
                          style={{ width: 56, textAlign: 'center', padding: '0.3rem' }}
                          type="number"
                          min={0}
                          value={p.stockCount}
                          onChange={(e) => setStock(p.id, Math.floor(Number(e.target.value) || 0))}
                          aria-label={`Stock for ${p.title}`}
                        />
                        <button className={styles.iconBtn} aria-label={`Increase stock for ${p.title}`} onClick={() => setStock(p.id, p.stockCount + 1)}>
                          <Plus size={14} />
                        </button>
                        {p.stockCount === 0 ? <Badge tone="critical">Out</Badge> : p.stockCount <= LOW_STOCK_THRESHOLD && <Badge tone="warning">Low</Badge>}
                      </div>
                    </td>
                    <td className={styles.num}>{unitsSold.get(p.id) || 0}</td>
                    <td className={styles.num}>
                      {confirmDelete === p.id ? (
                        <span className={styles.actions} style={{ justifyContent: 'flex-end' }}>
                          <button
                            className={styles.btnDanger}
                            onClick={() => {
                              deleteProduct(p.id);
                              setConfirmDelete(null);
                            }}
                          >
                            Delete
                          </button>
                          <button className={styles.btn} onClick={() => setConfirmDelete(null)}>
                            Keep
                          </button>
                        </span>
                      ) : (
                        <>
                          <Link href={`/admin/products/${p.id}`} className={styles.iconBtn} aria-label={`Edit ${p.title}`}>
                            <Pencil size={15} />
                          </Link>
                          <button className={styles.iconBtn} aria-label={`Delete ${p.title}`} onClick={() => setConfirmDelete(p.id)}>
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
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
