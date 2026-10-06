import {
  fetchPaymentMethod,
  getGatewayMode,
  signMockPayment,
  verifyPaymentSignature
} from '@/lib/payments/razorpay.server';

export async function POST(request: Request) {
  let body: { gatewayOrderId?: string; paymentId?: string; signature?: string; mockOutcome?: 'success' };
  try {
    body = await request.json();
  } catch {
    return Response.json({ verified: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { gatewayOrderId, paymentId } = body;
  let { signature } = body;
  if (!gatewayOrderId || !paymentId) {
    return Response.json({ verified: false, error: 'Missing payment identifiers' }, { status: 400 });
  }

  // Mock gateway: the server plays Razorpay and signs the simulated payment itself.
  if (getGatewayMode() === 'mock' && body.mockOutcome === 'success' && gatewayOrderId.startsWith('order_mock_')) {
    signature = signMockPayment(gatewayOrderId, paymentId);
  }

  if (!signature || !verifyPaymentSignature(gatewayOrderId, paymentId, signature)) {
    return Response.json({ verified: false, error: 'Payment signature mismatch' }, { status: 400 });
  }

  const method = await fetchPaymentMethod(paymentId);
  return Response.json({ verified: true, paymentId, method });
}
