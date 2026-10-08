import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getStore } from '@netlify/blobs';

/**
 * Tiny JSON key-value store: Netlify Blobs when deployed on Netlify, files under ./data in local dev.
 * Keys may contain only [A-Za-z0-9_-].
 */
const DATA_DIR = path.join(process.cwd(), 'data');

function blobStore(name: string) {
  // Netlify injects the blobs context into functions; without it getStore throws, so fall back to disk.
  try {
    return getStore({ name, consistency: 'strong' });
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
