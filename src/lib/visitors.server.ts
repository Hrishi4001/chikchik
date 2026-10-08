import { createHash, randomBytes } from 'node:crypto';
import { kvGet, kvSet } from './kv.server';

/**
 * Visitor analytics, cookie consents and phone leads, kept in the shared KV store
 * (Netlify Blobs in production). Visits are sharded by month so each page view rewrites one small blob.
 */
const STORE = 'visitors';
const RETENTION_DAYS = 180;
const MAX_VISITS_PER_MONTH = 50000;

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

const monthKey = (t: number) => `visits-${new Date(t).toISOString().slice(0, 7)}`;

function retainedMonths() {
  const keys = new Set<string>();
  for (let t = Date.now() - RETENTION_DAYS * 86400000; t <= Date.now() + 86400000; t += 15 * 86400000) keys.add(monthKey(t));
  keys.add(monthKey(Date.now()));
  return [...keys];
}

let queue: Promise<unknown> = Promise.resolve();

/** Serialise writes within this instance so concurrent requests don't clobber each other. */
function serial<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn);
  queue = run.catch(() => undefined);
  return run;
}

export async function readDb(): Promise<Db> {
  const cutoff = Date.now() - RETENTION_DAYS * 86400000;
  const [salt, consents, leads, ...months] = await Promise.all([
    kvGet<Db['salt']>(STORE, 'salt'),
    kvGet<ConsentRecord[]>(STORE, 'consents'),
    kvGet<Lead[]>(STORE, 'leads'),
    ...retainedMonths().map((k) => kvGet<Visit[]>(STORE, k))
  ]);
  return {
    salt: salt ?? { day: '', value: '' },
    visits: months.flatMap((m) => m ?? []).filter((v) => v.t > cutoff).sort((a, b) => a.t - b.t),
    consents: consents ?? [],
    leads: leads ?? []
  };
}

async function dailySalt() {
  const day = new Date().toISOString().slice(0, 10);
  const salt = await kvGet<Db['salt']>(STORE, 'salt');
  if (salt?.day === day) return salt.value;
  const fresh = { day, value: randomBytes(16).toString('hex') };
  await kvSet(STORE, 'salt', fresh);
  return fresh.value;
}

export function recordVisit(v: Omit<Visit, 'vh' | 't'> & { ip: string; ua: string }) {
  const { ip, ua, ...rest } = v;
  return serial(async () => {
    const vh = createHash('sha256').update(`${await dailySalt()}|${ip}|${ua}`).digest('hex').slice(0, 16);
    const key = monthKey(Date.now());
    const visits = (await kvGet<Visit[]>(STORE, key)) ?? [];
    visits.push({ ...rest, vh, t: Date.now() });
    await kvSet(STORE, key, visits.slice(-MAX_VISITS_PER_MONTH));
  });
}

export function recordConsent(c: Omit<ConsentRecord, 't'>) {
  return serial(async () => {
    const cutoff = Date.now() - RETENTION_DAYS * 86400000;
    const consents = ((await kvGet<ConsentRecord[]>(STORE, 'consents')) ?? []).filter((x) => x.t > cutoff);
    consents.push({ ...c, t: Date.now() });
    await kvSet(STORE, 'consents', consents);
  });
}

export function recordLead(l: Omit<Lead, 'id' | 't'>) {
  return serial(async () => {
    const leads = (await kvGet<Lead[]>(STORE, 'leads')) ?? [];
    let lead = leads.find((x) => x.phone === l.phone);
    if (lead) Object.assign(lead, l, { t: Date.now() });
    else {
      lead = { ...l, id: randomBytes(6).toString('hex'), t: Date.now() };
      leads.push(lead);
    }
    await kvSet(STORE, 'leads', leads);
    return lead;
  });
}

export function deleteLead(id: string) {
  return serial(async () => {
    const leads = (await kvGet<Lead[]>(STORE, 'leads')) ?? [];
    const kept = leads.filter((l) => l.id !== id);
    await kvSet(STORE, 'leads', kept);
    return kept.length !== leads.length;
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
