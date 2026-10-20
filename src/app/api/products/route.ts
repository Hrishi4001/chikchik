import { NextResponse } from 'next/server';
import { listProducts } from '@/lib/products.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ products: await listProducts() });
}
