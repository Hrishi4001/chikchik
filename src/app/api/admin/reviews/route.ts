import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { listReviews } from '@/lib/reviews.server';

export const runtime = 'nodejs';

export async function GET() {
  if (!(await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ reviews: await listReviews() });
}
