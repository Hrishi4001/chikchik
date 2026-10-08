import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { getOrder, saveOrder } from '@/lib/orders.server';
import type { Order } from '@/lib/types';

export const runtime = 'nodejs';

// Fields staff may change; items and totals stay as the server priced them.
const EDITABLE = ['fulfillmentStatus', 'paymentStatus', 'paymentMethod', 'payment', 'courier', 'trackingNumber', 'history'] as const;

export async function PUT(request: Request, ctx: RouteContext<'/api/admin/orders/[orderId]'>) {
  if (!(await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { orderId } = await ctx.params;
  const existing = await getOrder(orderId).catch(() => null);
  if (!existing) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  let body: Partial<Order>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const updated: Order = { ...existing };
  for (const key of EDITABLE) if (key in body) Object.assign(updated, { [key]: body[key] });
  await saveOrder(updated);
  return NextResponse.json({ order: updated });
}
