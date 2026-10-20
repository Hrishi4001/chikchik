import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getStore } from '@netlify/blobs';

/**
 * Tiny JSON key-value store: Netlify Blobs when deployed on Netlify, files under ./data/<namespace> in local dev.
 * Every store is prefixed with KV_NAMESPACE so this site never shares records with another deployment.
 * Keys may contain only [A-Za-z0-9_-].
 */
const NAMESPACE = (process.env.KV_NAMESPACE || 'chikchik').replace(/[^A-Za-z0-9_-]/g, '');
const DATA_DIR = path.join(process.cwd(), 'data', NAMESPACE);

function blobStore(name: string) {
  // Netlify injects the blobs context into functions; without it getStore throws, so fall back to disk.
  try {
    return getStore({ name: `${NAMESPACE}-${name}`, consistency: 'strong' });
  } catch {
    if (process.env.NETLIFY) throw new Error(`Netlify Blobs unavailable for store "${name}"`);
    return null;
  }
}

function safeKey(key: string) {
  if (!/^[A-Za-z0-9_-]{1,120}$/.test(key)) throw new Error(`Invalid key "${key}"`);
  return key;
}

export async function kvGet<T>(store: string, key: string): Promise<T | null> {
  const blobs = blobStore(store);
  if (blobs) return ((await blobs.get(safeKey(key), { type: 'json' })) as T | null) ?? null;
  try {
    return JSON.parse(await readFile(path.join(DATA_DIR, store, `${safeKey(key)}.json`), 'utf8')) as T;
  } catch {
    return null;
  }
}

export async function kvSet(store: string, key: string, value: unknown) {
  const blobs = blobStore(store);
  if (blobs) {
    await blobs.setJSON(safeKey(key), value);
    return;
  }
  await mkdir(path.join(DATA_DIR, store), { recursive: true });
  await writeFile(path.join(DATA_DIR, store, `${safeKey(key)}.json`), JSON.stringify(value));
}

export async function kvList<T>(store: string): Promise<T[]> {
  const blobs = blobStore(store);
  if (blobs) {
    const { blobs: entries } = await blobs.list();
    const values = await Promise.all(entries.map((e) => blobs.get(e.key, { type: 'json' }) as Promise<T | null>));
    return values.filter((v): v is NonNullable<typeof v> => v !== null);
  }
  let files: string[] = [];
  try {
    files = (await readdir(path.join(DATA_DIR, store))).filter((f) => f.endsWith('.json'));
  } catch {
    return [];
  }
  const values = await Promise.all(files.map((f) => kvGet<T>(store, f.slice(0, -5))));
  return values.filter((v): v is NonNullable<typeof v> => v !== null);
}

export async function kvDelete(store: string, key: string) {
  const blobs = blobStore(store);
  if (blobs) {
    await blobs.delete(safeKey(key));
    return;
  }
  await rm(path.join(DATA_DIR, store, `${safeKey(key)}.json`), { force: true });
}

/** Binary values (images); stored as raw bytes under ./data/<namespace>/<store>/<key>.bin locally. */
export async function kvSetBytes(store: string, key: string, bytes: Buffer) {
  const blobs = blobStore(store);
  if (blobs) {
    await blobs.set(safeKey(key), new Uint8Array(bytes).buffer);
    return;
  }
  await mkdir(path.join(DATA_DIR, store), { recursive: true });
  await writeFile(path.join(DATA_DIR, store, `${safeKey(key)}.bin`), bytes);
}

export async function kvGetBytes(store: string, key: string): Promise<Buffer | null> {
  const blobs = blobStore(store);
  if (blobs) {
    const data = await blobs.get(safeKey(key), { type: 'arrayBuffer' });
    return data ? Buffer.from(data) : null;
  }
  try {
    return await readFile(path.join(DATA_DIR, store, `${safeKey(key)}.bin`));
  } catch {
    return null;
  }
}
