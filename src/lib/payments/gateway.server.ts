import { isCashfreeConfigured } from './cashfree.server';
import { getGatewayMode as getRazorpayMode } from './razorpay.server';

export type ActiveGateway = 'cashfree' | 'razorpay' | 'mock';

/** Cashfree wins when its keys are set, then Razorpay, else the local mock gateway. */
export function getGatewayMode(): ActiveGateway {
  return isCashfreeConfigured() ? 'cashfree' : getRazorpayMode();
}
