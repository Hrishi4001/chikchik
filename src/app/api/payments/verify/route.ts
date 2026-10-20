import { fetchPaymentMethod, signMockPayment, verifyPaymentSignature } from '@/lib/payments/razorpay.server';
import { getGatewayMode } from '@/lib/payments/gateway.server';
import { getOrder, markPaid, markPaymentFailed, settleCashfreeAttempt } from '@/lib/orders.server';
import type { PaymentMethod } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: { orderId?: string; gatewayOrderId?: string; paymentId?: string; signature?: string; mockOutcome?: 'success'; mockMethod?: PaymentMethod; failureReason?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ verified: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { orderId, gatewayOrderId, paymentId } = body;
  if (!orderId || !gatewayOrderId) {
    return Response.json({ verified: false, error: 'Missing payment identifiers' }, { status: 400 });
  }
  const order = await getOrder(orderId).catch(() => null);
  if (!order || !order.payment?.attempts.some((a) => a.gatewayOrderId === gatewayOrderId)) {
    return Response.json({ verified: false, error: 'Order not found' }, { status: 404 });
  }

  if (order.payment?.provider === 'cashfree') {
    // Cashfree: ask the gateway directly. A Cashfree success always wins over a browser failure report.
    const { outcome, order: updated } = await settleCashfreeAttempt(order, gatewayOrderId).catch((err) => {
      console.error('[payments] cashfree lookup failed', err);
      return { outcome: { status: 'pending' as const }, order };
    });
    if (outcome.status === 'paid') return Response.json({ verified: true, paymentId: outcome.paymentId, method: outcome.method, order: updated });
    if (body.failureReason && outcome.status === 'pending') {
      await markPaymentFailed(order, gatewayOrderId, body.failureReason.slice(0, 200), paymentId);
      return Response.json({ verified: false });
    }
    const error = outcome.status === 'failed' ? outcome.reason : 'Payment is still processing. We will confirm by SMS/email shortly.';
    return Response.json({ verified: false, error, order: updated });
  }

  // Browser reports a failed/abandoned attempt so the admin sees it; never trusted to mark anything paid.
  if (body.failureReason) {
    await markPaymentFailed(order, gatewayOrderId, body.failureReason.slice(0, 200), paymentId);
    return Response.json({ verified: false });
  }
  if (!paymentId) return Response.json({ verified: false, error: 'Missing payment identifiers' }, { status: 400 });

  let { signature } = body;
  // Mock gateway: the server plays Razorpay and signs the simulated payment itself.
  if (getGatewayMode() === 'mock' && body.mockOutcome === 'success' && gatewayOrderId.startsWith('order_mock_')) {
    signature = signMockPayment(gatewayOrderId, paymentId);
  }

  if (!signature || !verifyPaymentSignature(gatewayOrderId, paymentId, signature)) {
    return Response.json({ verified: false, error: 'Payment signature mismatch' }, { status: 400 });
  }

  const method = (await fetchPaymentMethod(paymentId)) || (getGatewayMode() === 'mock' ? body.mockMethod : undefined) || 'UPI';
  const updated = await markPaid(order, gatewayOrderId, paymentId, method);
  return Response.json({ verified: true, paymentId, method, order: updated });
}
