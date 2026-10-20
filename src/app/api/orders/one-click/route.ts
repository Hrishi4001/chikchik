import { OrderError, placeOneClickOrder } from '@/lib/orders.server';
import type { OneClickOrderInput } from '@/lib/types';

export const runtime = 'nodejs';

/** Cashfree One Click Checkout: prices the bag and opens a Cashfree order that collects address + payment. */
export async function POST(request: Request) {
  let body: OneClickOrderInput;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    return Response.json(await placeOneClickOrder(body, new URL(request.url).origin));
  } catch (err) {
    if (err instanceof OrderError) return Response.json({ error: err.message }, { status: err.status });
    console.error('[orders] one-click failed', err);
    return Response.json({ error: 'Express checkout is unavailable. Please use regular checkout.' }, { status: 502 });
  }
}
