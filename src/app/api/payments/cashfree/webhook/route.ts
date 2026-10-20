import { verifyCashfreeWebhook } from '@/lib/payments/cashfree.server';
import { findOrderByGatewayId, saveOrder, settleCashfreeAttempt } from '@/lib/orders.server';

export const runtime = 'nodejs';

/**
 * Cashfree webhook (Dashboard → Developers → Webhooks, API version 2023-08-01).
 * Source of truth when the shopper closes the browser before the client verify call.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  const ok = verifyCashfreeWebhook(raw, request.headers.get('x-webhook-timestamp') ?? '', request.headers.get('x-webhook-signature') ?? '');
  if (!ok) return Response.json({ ok: false }, { status: 401 });

  const event = JSON.parse(raw) as {
    type: string;
    data?: {
      order?: { order_id: string };
      payment?: { cf_payment_id: string | number; payment_status: string };
      refund?: { order_id: string; refund_status: string; refund_amount: number };
    };
  };
  const gatewayOrderId = event.data?.order?.order_id || event.data?.refund?.order_id;
  console.info('[payments] cashfree webhook', event.type, gatewayOrderId, event.data?.payment?.payment_status);
  if (!gatewayOrderId) return Response.json({ ok: true });

  const order = await findOrderByGatewayId(gatewayOrderId);
  if (!order) return Response.json({ ok: true });

  if (event.type.startsWith('PAYMENT_')) {
    // Re-read from the API instead of trusting the payload's status.
    await settleCashfreeAttempt(order, gatewayOrderId);
  } else if (event.type === 'REFUND_STATUS_WEBHOOK' && event.data?.refund?.refund_status === 'SUCCESS' && order.paymentStatus !== 'Refunded') {
    const at = new Date().toISOString();
    await saveOrder({
      ...order,
      paymentStatus: 'Refunded',
      payment: { ...order.payment!, refundedAt: at, refundAmount: event.data.refund.refund_amount ?? order.total },
      history: [...(order.history || []), { at, label: 'Refund processed' }]
    });
  }
  return Response.json({ ok: true });
}
