import { getGatewayMode } from '@/lib/payments/razorpay.server';

export async function GET() {
  const mode = getGatewayMode();
  return Response.json({ mode, keyId: mode === 'razorpay' ? process.env.RAZORPAY_KEY_ID : null });
}
