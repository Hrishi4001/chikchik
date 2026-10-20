import { OrderError, placeOrder, type PlaceOrderInput } from '@/lib/orders.server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: PlaceOrderInput;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    return Response.json(await placeOrder(body, new URL(request.url).origin));
  } catch (err) {
    if (err instanceof OrderError) return Response.json({ error: err.message }, { status: err.status });
    console.error('[orders] place failed', err);
    return Response.json({ error: 'We could not place your order. Please try again.' }, { status: 502 });
  }
}
