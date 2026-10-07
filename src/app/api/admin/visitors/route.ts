import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { deleteLead, readDb } from '@/lib/visitors.server';

export const runtime = 'nodejs';

async function authorised() {
  // Proxy already gates this route; re-check here since route handlers must not rely on proxy alone
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function GET(request: Request) {
  if (!(await authorised())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const days = Math.min(Math.max(Number(new URL(request.url).searchParams.get('days')) || 30, 1), 180);
  const since = Date.now() - days * 2 * 86400000; // include the previous period for comparisons
  const db = await readDb();
  const firstSeen = new Map<string, number>();
  for (const v of db.visits) if (v.vid && !firstSeen.has(v.vid)) firstSeen.set(v.vid, v.t);
  return NextResponse.json({
    // A consented visitor is "returning" if first seen more than 30 minutes before this view
    visits: db.visits
      .filter((v) => v.t > since)
      .map(({ vid, ...v }) => ({ ...v, returning: !!vid && firstSeen.get(vid)! < v.t - 30 * 60000 })),
    consents: db.consents.filter((c) => c.t > since),
    leads: [...db.leads].sort((a, b) => b.t - a.t),
  });
}

export async function DELETE(request: Request) {
  if (!(await authorised())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('lead');
  if (!id || !(await deleteLead(id))) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
