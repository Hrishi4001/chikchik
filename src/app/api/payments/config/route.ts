import { getGatewayMode } from '@/lib/payments/gateway.server';
import { getCashfreeEnv, isOneClickEnabled } from '@/lib/payments/cashfree.server';

export async function GET() {
  const mode = getGatewayMode();
  return Response.json({ mode, keyId: mode === 'razorpay' ? process.env.RAZORPAY_KEY_ID : null, cashfreeEnv: mode === 'cashfree' ? getCashfreeEnv() : null, oneClick: isOneClickEnabled() });
}
