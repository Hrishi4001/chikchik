import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { randomBytes } from 'node:crypto';
import { geoFromHeaders, recordConsent } from '@/lib/visitors.server';

export const runtime = 'nodejs';

/** Audit log of cookie choices (DPDP Act s.6 — consent must be demonstrable). Stores no personal identifiers. */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { analytics?: unknown; marketing?: unknown } | null;
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  await recordConsent({
    id: randomBytes(6).toString('hex'),
    analytics: body.analytics === true,
    marketing: body.marketing === true,
    country: geoFromHeaders(request.headers).country,
  });
  return new NextResponse(null, { status: 204 });
}
