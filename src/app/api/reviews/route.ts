import { addReview, listReviews, publicReview, ReviewError } from '@/lib/reviews.server';

export const runtime = 'nodejs';

export async function GET() {
  const reviews = (await listReviews()).filter((r) => !r.hidden).map(publicReview);
  return Response.json({ reviews });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  try {
    return Response.json({ review: publicReview(await addReview(body)) });
  } catch (err) {
    if (err instanceof ReviewError) return Response.json({ error: err.message }, { status: 400 });
    console.error('[reviews] add failed', err);
    return Response.json({ error: 'Could not post your review. Please try again.' }, { status: 502 });
  }
}
