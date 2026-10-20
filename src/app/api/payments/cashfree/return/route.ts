import { findOrderByGatewayId, settleCashfreeAttempt } from '@/lib/orders.server';

export const runtime = 'nodejs';

/** Landing point when Cashfree redirects the shopper back (bank/UPI flows that leave the modal). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const gatewayOrderId = url.searchParams.get('order_id') ?? '';
  const order = gatewayOrderId ? await findOrderByGatewayId(gatewayOrderId) : null;
  if (!order) return Response.redirect(new URL('/checkout?payment=failed', url.origin), 303);

  const { outcome } = await settleCashfreeAttempt(order, gatewayOrderId).catch(() => ({ outcome: { status: 'pending' as const } }));
  const target = outcome.status === 'failed' ? '/checkout?payment=failed' : `/order-success/${order.id}`;
  return Response.redirect(new URL(target, url.origin), 303);
}
