import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { setReviewHidden } from '@/lib/reviews.server';

export const runtime = 'nodejs';

/** Hide or re-publish a review (body: { hidden: boolean }). */
export async function PATCH(request: Request, ctx: RouteContext<'/api/admin/reviews/[reviewId]'>) {
  if (!(await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { reviewId } = await ctx.params;
  const { hidden } = (await request.json().catch(() => ({}))) as { hidden?: boolean };
  const review = await setReviewHidden(reviewId, !!hidden);
  return review ? NextResponse.json({ review }) : NextResponse.json({ error: 'Not found' }, { status: 404 });
}
