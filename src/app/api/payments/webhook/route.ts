import { verifyWebhookSignature } from '@/lib/payments/razorpay.server';

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

  const event = JSON.parse(raw) as { event: string; payload?: { payment?: { entity?: { id: string; order_id: string; status: string } } } };
  const payment = event.payload?.payment?.entity;

  // TODO: once orders live in a database, update the order matching payment.order_id here
  // (mark Paid on payment.captured, Failed on payment.failed, Refunded on refund.processed).
  console.info('[payments] webhook', event.event, payment?.order_id, payment?.id, payment?.status);

  return Response.json({ ok: true });
}
