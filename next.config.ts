import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let phones on the local network load dev JS (otherwise pages don't hydrate and buttons do nothing)
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*'],
  experimental: {
    // Admin image uploads pass through proxy, which buffers bodies up to this size
    proxyClientMaxBodySize: '16mb',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.theopenform.in',
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
