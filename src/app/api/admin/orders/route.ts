import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { listOrders } from '@/lib/orders.server';

export const runtime = 'nodejs';

export async function GET() {
  // Proxy already gates this route; re-check here since route handlers must not rely on proxy alone
  if (!(await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ orders: await listOrders() });
}
