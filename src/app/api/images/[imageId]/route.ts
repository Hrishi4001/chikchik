import { kvGetBytes } from '@/lib/kv.server';

export const runtime = 'nodejs';

/** Serves product images uploaded from the admin; ids are content-unique so they cache forever. */
export async function GET(_request: Request, ctx: RouteContext<'/api/images/[imageId]'>) {
  const { imageId } = await ctx.params;
  const key = imageId.replace(/\.webp$/, '');
  const bytes = /^[A-Za-z0-9_-]{1,120}$/.test(key) ? await kvGetBytes('images', key) : null;
  if (!bytes) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(bytes), {
    headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=31536000, immutable' }
  });
}
