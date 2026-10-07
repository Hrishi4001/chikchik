import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomBytes } from 'node:crypto';

/**
 * File-backed store for visitor analytics, cookie consents and phone leads.
 * Swap for a database before deploying to a host with a read-only filesystem (e.g. Vercel).
 */
const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'visitors.json');
const RETENTION_DAYS = 180;
const MAX_VISITS = 50000;

export interface Visit {
  t: number;
  /** Daily-rotating hash of IP + user agent; cannot be reversed or linked across days. */
  vh: string;
  /** Persistent visitor id, only present when analytics cookies were accepted. */
  vid?: string;
  path: string;
  country: string;
  region?: string;
  city?: string;
  device: string;
  browser?: string;
  referrer?: string;
}

export interface ConsentRecord {
  t: number;
  id: string;
  analytics: boolean;
  marketing: boolean;
  country: string;
}

export interface Lead {
  id: string;
  t: number;
  phone: string;
  name?: string;
  source: string;
  whatsappOptIn: boolean;
  country: string;
  policyVersion: string;
}

interface Db {
  salt: { day: string; value: string };
  visits: Visit[];
  consents: ConsentRecord[];
  leads: Lead[];
}

let cache: Db | null = null;
let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<Db> {
  if (cache) return cache;
  try {
    cache = JSON.parse(await readFile(FILE, 'utf8')) as Db;
  } catch {
    cache = { salt: { day: '', value: '' }, visits: [], consents: [], leads: [] };
  }
  return cache;
}

/** Serialise read-modify-write so concurrent requests don't clobber each other. */
function mutate<T>(fn: (db: Db) => T): Promise<T> {
  const run = queue.then(async () => {
    const db = await load();
    const result = fn(db);
    const cutoff = Date.now() - RETENTION_DAYS * 86400000;
    db.visits = db.visits.filter((v) => v.t > cutoff).slice(-MAX_VISITS);
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(FILE, JSON.stringify(db));
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

export function readDb() {
  return queue.then(load);
}

function dailySalt(db: Db) {
  const day = new Date().toISOString().slice(0, 10);
  if (db.salt.day !== day) db.salt = { day, value: randomBytes(16).toString('hex') };
  return db.salt.value;
}

export function recordVisit(v: Omit<Visit, 'vh' | 't'> & { ip: string; ua: string }) {
  const { ip, ua, ...rest } = v;
  return mutate((db) => {
    const vh = createHash('sha256').update(`${dailySalt(db)}|${ip}|${ua}`).digest('hex').slice(0, 16);
    db.visits.push({ ...rest, vh, t: Date.now() });
  });
}

export function recordConsent(c: Omit<ConsentRecord, 't'>) {
  return mutate((db) => {
    db.consents.push({ ...c, t: Date.now() });
  });
}

export function recordLead(l: Omit<Lead, 'id' | 't'>) {
  return mutate((db) => {
    const existing = db.leads.find((x) => x.phone === l.phone);
    if (existing) {
      Object.assign(existing, l, { t: Date.now() });
      return existing;
    }
    const lead = { ...l, id: randomBytes(6).toString('hex'), t: Date.now() };
    db.leads.push(lead);
    return lead;
  });
}

export function deleteLead(id: string) {
  return mutate((db) => {
    const before = db.leads.length;
    db.leads = db.leads.filter((l) => l.id !== id);
    return db.leads.length !== before;
  });
}

/** Location comes from CDN headers (Vercel / Cloudflare); unavailable on localhost. */
export function geoFromHeaders(h: Headers) {
  const decode = (s: string | null) => (s ? decodeURIComponent(s) : undefined);
  const country = h.get('x-vercel-ip-country') || h.get('cf-ipcountry') || '';
  return {
    country: /^[A-Za-z]{2}$/.test(country) && country.toUpperCase() !== 'XX' ? country.toUpperCase() : 'Unknown',
    region: decode(h.get('x-vercel-ip-country-region') || h.get('cf-region')),
    city: decode(h.get('x-vercel-ip-city') || h.get('cf-ipcity')),
  };
}

export function clientIp(h: Headers) {
  return h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
}
