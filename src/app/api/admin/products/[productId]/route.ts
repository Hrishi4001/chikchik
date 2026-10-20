import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { deleteProduct, ProductError, updateProduct } from '@/lib/products.server';
import type { Product } from '@/lib/types';

export const runtime = 'nodejs';

async function authorized() {
  return !!(await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value));
}

export async function PATCH(request: Request, ctx: RouteContext<'/api/admin/products/[productId]'>) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { productId } = await ctx.params;
  const updates = (await request.json().catch(() => null)) as Partial<Product> | null;
  if (!updates) return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
  try {
    const product = await updateProduct(productId, updates);
    return product ? NextResponse.json({ product }) : NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (e) {
    if (e instanceof ProductError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }
}

export async function DELETE(_request: Request, ctx: RouteContext<'/api/admin/products/[productId]'>) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { productId } = await ctx.params;
  return (await deleteProduct(productId)) ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Not found' }, { status: 404 });
}
