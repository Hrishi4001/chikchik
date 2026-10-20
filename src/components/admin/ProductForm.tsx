'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import type { Product } from '@/lib/types';
import ImageDropzone from './ImageDropzone';
import styles from '@/app/admin/admin.module.css';

const SIZE_OPTIONS = ['One Size', 'Gift Boxed', 'Pack of 2'];

const lines = (s: string) =>
  s
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

function slugLabel(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { products, addProduct, updateProduct } = useStore();

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => map.set(p.category, p.categoryLabel));
    return [...map.entries()];
  }, [products]);

  const [title, setTitle] = useState(product?.title || '');
  const [subtitle, setSubtitle] = useState(product?.subtitle || '');
  const [category, setCategory] = useState(product?.category || categories[0]?.[0] || '');
  const [newCategory, setNewCategory] = useState('');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [compareAt, setCompareAt] = useState(product?.compareAtPrice ? String(product.compareAtPrice) : '');
  const [stock, setStock] = useState(product ? String(product.stockCount) : '10');
  const [fabric, setFabric] = useState(product?.fabric || '');
  const [craft, setCraft] = useState(product?.craft || '');
  const [origin, setOrigin] = useState(product?.origin || '');
  const [color, setColor] = useState(product?.color || '');
  const [colorHex, setColorHex] = useState(product?.colorHex || '#FFC800');
  const [imageList, setImageList] = useState<string[]>(product?.images || []);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState(product?.description || '');
  const [details, setDetails] = useState(product?.craftsmanshipDetails.join('\n') || '');
  const [washCare, setWashCare] = useState(product?.washCare.join('\n') || 'Wipe clean with a soft, dry cloth');
  const [sizes, setSizes] = useState<string[]>(product?.sizes || ['100 g']);
  const [isNewArrival, setIsNewArrival] = useState(product?.isNewArrival ?? true);
  const [isBestseller, setIsBestseller] = useState(product?.isBestseller ?? false);
  const isHandwoven = product?.isHandwoven ?? false;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleSize = (s: string) => setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    const priceN = Number(price);
    const compareN = compareAt ? Number(compareAt) : undefined;
    const stockN = Number(stock);
    const finalCategory = category === '__new' ? newCategory.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : category;

    if (!title.trim()) err.title = 'Title is required';
    if (!Number.isFinite(priceN) || priceN <= 0) err.price = 'Enter a price above 0';
    if (compareN !== undefined && (!Number.isFinite(compareN) || compareN <= priceN)) err.compareAt = 'Must be higher than the price';
    if (!Number.isInteger(stockN) || stockN < 0) err.stock = 'Enter a whole number, 0 or more';
    if (!finalCategory) err.category = 'Choose or create a category';
    if (!imageList.length) err.images = 'Add at least one image';
    if (!sizes.length) err.sizes = 'Select at least one variant';
    if (!product && products.some((p) => p.title.trim().toLowerCase() === title.trim().toLowerCase())) err.title = 'A product with this title already exists';
    setErrors(err);
    if (Object.keys(err).length) return;

    const data = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      category: finalCategory,
      categoryLabel: category === '__new' ? slugLabel(finalCategory) : categories.find(([c]) => c === finalCategory)?.[1] || slugLabel(finalCategory),
      price: priceN,
      compareAtPrice: compareN,
      stockCount: stockN,
      inStock: stockN > 0,
      fabric: fabric.trim(),
      craft: craft.trim(),
      origin: origin.trim(),
      color: color.trim(),
      colorHex,
      images: imageList,
      description: description.trim(),
      craftsmanshipDetails: lines(details),
      washCare: lines(washCare),
      sizes,
      isNewArrival,
      isBestseller,
      isHandwoven
    };

    const saved = product ? await updateProduct(product.id, data) : await addProduct({ ...data, reviews: [], rating: 0, reviewCount: 0 });
    if (saved) router.push('/admin/products');
  };

  const field = (id: string, label: string, input: React.ReactNode, hint?: string) => (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {input}
      {errors[id] ? <span className={styles.fieldError}>{errors[id]}</span> : hint && <span className={styles.fieldHint}>{hint}</span>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className={styles.twoCol}>
      <div className={styles.grid} style={{ alignContent: 'start' }}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Details</h2>
          </div>
          <div className={styles.grid}>
            {field('title', 'Title *', <input id="title" className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />)}
            {field('subtitle', 'Subtitle', <input id="subtitle" className={styles.input} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />)}
            {field('description', 'Description', <textarea id="description" rows={5} className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} />)}
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Media</h2>
          </div>
          <ImageDropzone images={imageList} onChange={setImageList} nameHint={title} />
          {errors.images && <span className={styles.fieldError}>{errors.images}</span>}
          <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr auto', marginTop: '0.75rem', alignItems: 'end' }}>
            {field('imageUrl', 'Or add by URL', <input id="imageUrl" className={styles.input} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />)}
            <button
              type="button"
              className={styles.btn}
              disabled={!imageUrl.trim()}
              onClick={() => {
                setImageList((prev) => [...prev, imageUrl.trim()]);
                setImageUrl('');
              }}
            >
              Add
            </button>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Craft & care</h2>
          </div>
          <div className={styles.formGrid}>
            {field('fabric', 'Material & finish', <input id="fabric" className={styles.input} value={fabric} onChange={(e) => setFabric(e.target.value)} />)}
            {field('craft', 'Product type', <input id="craft" className={styles.input} value={craft} onChange={(e) => setCraft(e.target.value)} />)}
            {field('origin', 'Origin', <input id="origin" className={styles.input} value={origin} onChange={(e) => setOrigin(e.target.value)} />)}
          </div>
          <div className={styles.formGrid} style={{ marginTop: '1rem' }}>
            {field('details', 'Highlights', <textarea id="details" rows={4} className={styles.textarea} value={details} onChange={(e) => setDetails(e.target.value)} />, 'One per line')}
            {field('washCare', 'Care & safety', <textarea id="washCare" rows={4} className={styles.textarea} value={washCare} onChange={(e) => setWashCare(e.target.value)} />, 'One per line')}
          </div>
        </section>
      </div>

      <div className={styles.grid} style={{ alignContent: 'start' }}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Pricing & inventory</h2>
          </div>
          <div className={styles.grid}>
            {field('price', 'Price (₹) *', <input id="price" type="number" min={1} className={styles.input} value={price} onChange={(e) => setPrice(e.target.value)} />)}
            {field('compareAt', 'Compare-at price (₹)', <input id="compareAt" type="number" min={1} className={styles.input} value={compareAt} onChange={(e) => setCompareAt(e.target.value)} />, 'Shown struck through when higher than price')}
            {field('stock', 'Stock *', <input id="stock" type="number" min={0} step={1} className={styles.input} value={stock} onChange={(e) => setStock(e.target.value)} />)}
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Organisation</h2>
          </div>
          <div className={styles.grid}>
            {field(
              'category',
              'Category *',
              <select id="category" className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map(([c, label]) => (
                  <option key={c} value={c}>
                    {label}
                  </option>
                ))}
                <option value="__new">+ New category</option>
              </select>
            )}
            {category === '__new' && field('newCategory', 'New category name', <input id="newCategory" className={styles.input} value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />)}
            <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr auto' }}>
              {field('color', 'Variant name', <input id="color" className={styles.input} value={color} onChange={(e) => setColor(e.target.value)} />)}
              {field('colorHex', 'Swatch', <input id="colorHex" type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)} style={{ height: 38, width: 48, border: 'none', background: 'none' }} />)}
            </div>
            <div className={styles.field}>
              <label>Variants *</label>
              <div className={styles.chips}>
                {SIZE_OPTIONS.map((s) => (
                  <button type="button" key={s} aria-pressed={sizes.includes(s)} className={`${styles.chip} ${sizes.includes(s) ? styles.chipOn : ''}`} onClick={() => toggleSize(s)}>
                    {s}
                  </button>
                ))}
              </div>
              {errors.sizes && <span className={styles.fieldError}>{errors.sizes}</span>}
            </div>
            <div className={styles.field}>
              <label>Labels</label>
              {[
                ['New arrival', isNewArrival, setIsNewArrival],
                ['Bestseller', isBestseller, setIsBestseller]
              ].map(([label, checked, set]) => (
                <label key={label as string} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem', fontWeight: 400 }}>
                  <input type="checkbox" checked={checked as boolean} onChange={(e) => (set as (v: boolean) => void)(e.target.checked)} style={{ accentColor: '#111111' }} />
                  {label as string}
                </label>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.actions}>
          <button type="submit" className={styles.btnPrimary}>
            {product ? 'Save changes' : 'Publish product'}
          </button>
          <button type="button" className={styles.btn} onClick={() => router.push('/admin/products')}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
