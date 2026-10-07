import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CONSENT_VERSION } from '@/lib/consent';
import { geoFromHeaders, recordLead } from '@/lib/visitors.server';

export const runtime = 'nodejs';

/** Normalises Indian mobile numbers to +91XXXXXXXXXX; other countries must include their code. */
function normalisePhone(raw: string) {
  const digits = raw.replace(/[^\d+]/g, '');
  const local = digits.replace(/^\+?91(?=\d{10}$)/, '').replace(/^0(?=\d{10}$)/, '');
  if (/^[6-9]\d{9}$/.test(local)) return `+91${local}`;
  if (/^\+\d{8,15}$/.test(digits)) return digits;
  return null;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const phone = normalisePhone(String(body?.phone ?? ''));
  if (!phone) return NextResponse.json({ error: 'Enter a valid 10-digit mobile number' }, { status: 400 });
  // Explicit, unbundled consent is required before we store a number for marketing
  if (body?.consent !== true) return NextResponse.json({ error: 'Please agree to be contacted' }, { status: 400 });

  await recordLead({
    phone,
    name: typeof body.name === 'string' ? body.name.trim().slice(0, 80) || undefined : undefined,
    source: typeof body.source === 'string' ? body.source.slice(0, 40) : 'popup',
    whatsappOptIn: body.whatsapp === true,
    country: geoFromHeaders(request.headers).country,
    policyVersion: CONSENT_VERSION,
  });
  return NextResponse.json({ ok: true });
}
