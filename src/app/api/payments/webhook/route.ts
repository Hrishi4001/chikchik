import { verifyWebhookSignature } from '@/lib/payments/razorpay.server';
import { findOrderByGatewayId, markPaid, markPaymentFailed, saveOrder } from '@/lib/orders.server';

export const runtime = 'nodejs';

/**
 * Razorpay webhook endpoint (configure in Dashboard → Webhooks, set RAZORPAY_WEBHOOK_SECRET).
 * Webhooks are the source of truth for payment.captured / payment.failed / refund.processed,
 * covering cases where the customer closes the browser before the client-side verify call.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get('x-razorpay-signature') ?? '';

  if (!verifyWebhookSignature(raw, signature)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const event = JSON.parse(raw) as {
    event: string;
    payload?: {
      payment?: { entity?: { id: string; order_id: string; status: string; error_description?: string } };
      refund?: { entity?: { amount: number } };
    };
  };
  const payment = event.payload?.payment?.entity;
  console.info('[payments] webhook', event.event, payment?.order_id, payment?.id, payment?.status);
  if (!payment?.order_id) return Response.json({ ok: true });

  const order = await findOrderByGatewayId(payment.order_id);
  if (!order) return Response.json({ ok: true });

  if (event.event === 'payment.captured') await markPaid(order, payment.order_id, payment.id);
  else if (event.event === 'payment.failed') await markPaymentFailed(order, payment.order_id, payment.error_description || 'Payment failed', payment.id);
  else if (event.event === 'refund.processed' && order.paymentStatus !== 'Refunded') {
    const at = new Date().toISOString();
    await saveOrder({
      ...order,
      paymentStatus: 'Refunded',
      payment: { ...order.payment!, refundedAt: at, refundAmount: (event.payload?.refund?.entity?.amount ?? order.total * 100) / 100 },
      history: [...(order.history || []), { at, label: 'Refund processed' }]
    });
  }
  return Response.json({ ok: true });
}
