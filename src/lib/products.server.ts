import { randomBytes } from 'node:crypto';
import { INITIAL_PRODUCTS } from './data';
import { kvDelete, kvGet, kvList, kvSet } from './kv.server';
import type { Product } from './types';

const STORE = 'products';

export class ProductError extends Error {}

type StoredProduct = Product & { createdAt: string };

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

/** Catalog = products saved from the admin, newest first, plus any shipped seed products not overridden. */
export async function listProducts(): Promise<Product[]> {
  const saved = (await kvList<StoredProduct>(STORE)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const ids = new Set(saved.map((p) => p.id));
  return [...saved, ...INITIAL_PRODUCTS.filter((p) => !ids.has(p.id))];
}

export async function getProduct(id: string) {
  return (await listProducts()).find((p) => p.id === id) ?? null;
}

export async function getProductBySlug(slug: string) {
  return (await listProducts()).find((p) => p.slug === slug) ?? null;
}

function validate(input: Partial<Product>) {
  const title = String(input.title ?? '').trim();
  if (!title) throw new ProductError('Title is required');
  if (!(Number(input.price) > 0)) throw new ProductError('Enter a price above 0');
  if (!Number.isInteger(Number(input.stockCount)) || Number(input.stockCount) < 0) throw new ProductError('Enter a valid stock count');
  if (!Array.isArray(input.images) || !input.images.length) throw new ProductError('Add at least one image');
  return title;
}

export async function createProduct(input: Omit<Product, 'id' | 'slug'>) {
  const title = validate(input);
  const products = await listProducts();
  if (products.some((p) => p.title.trim().toLowerCase() === title.toLowerCase())) throw new ProductError('A product with this title already exists');
  let slug = slugify(title) || 'product';
  if (products.some((p) => p.slug === slug)) slug = `${slug}-${randomBytes(2).toString('hex')}`;
  const product: StoredProduct = { ...input, title, id: `prod-${Date.now().toString(36)}${randomBytes(2).toString('hex')}`, slug, createdAt: new Date().toISOString() };
  await kvSet(STORE, product.id, product);
  return product;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const existing = (await kvGet<StoredProduct>(STORE, id)) ?? INITIAL_PRODUCTS.find((p) => p.id === id);
  if (!existing) return null;
  const merged = { ...existing, ...updates, id: existing.id, slug: existing.slug } as StoredProduct;
  validate(merged);
  merged.createdAt ??= new Date().toISOString();
  await kvSet(STORE, id, merged);
  return merged;
}

export async function deleteProduct(id: string) {
  if (!(await kvGet(STORE, id))) return false;
  await kvDelete(STORE, id);
  return true;
}
