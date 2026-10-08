import { getOrder, OrderError, startPayment } from '@/lib/orders.server';

export const runtime = 'nodejs';

/** Retry payment on an existing order without creating a new one. */
export async function POST(_request: Request, ctx: RouteContext<'/api/orders/[orderId]/pay'>) {
  const { orderId } = await ctx.params;
  const order = await getOrder(orderId).catch(() => null);
  if (!order || order.paymentMethod === 'COD') return Response.json({ error: 'Order not found' }, { status: 404 });

  try {
    return Response.json(await startPayment(order));
  } catch (err) {
    if (err instanceof OrderError) return Response.json({ error: err.message }, { status: err.status });
    console.error('[orders] retry payment failed', err);
    return Response.json({ error: 'Payment gateway unavailable. Please try again.' }, { status: 502 });
  }
}
