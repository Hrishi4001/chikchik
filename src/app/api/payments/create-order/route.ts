import { createGatewayOrder, getGatewayMode } from '@/lib/payments/razorpay.server';

// Upper bound guards against obviously bad amounts until order totals are recomputed server-side from a real catalog.
const MAX_AMOUNT_INR = 10_00_000;

export async function POST(request: Request) {
  let body: { amount?: unknown; receipt?: unknown; customer?: { name?: string; email?: string; phone?: string } };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const amount = Number(body.amount);
  const receipt = typeof body.receipt === 'string' ? body.receipt.slice(0, 40) : '';
  if (!Number.isFinite(amount) || amount < 1 || amount > MAX_AMOUNT_INR || !receipt) {
    return Response.json({ error: 'Invalid amount or receipt' }, { status: 400 });
  }

  try {
    const order = await createGatewayOrder(Math.round(amount * 100), receipt, {
      customer_email: body.customer?.email ?? ''
    });
    const mode = getGatewayMode();
    return Response.json({
      mode,
      keyId: mode === 'razorpay' ? process.env.RAZORPAY_KEY_ID : null,
      gatewayOrderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    console.error('[payments] create-order failed', err);
    return Response.json({ error: 'Payment gateway unavailable. Please try again.' }, { status: 502 });
  }
}
