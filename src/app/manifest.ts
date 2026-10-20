import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Chikchik – Designer Lighters',
    short_name: 'Chikchik',
    description: 'Designer lighters with a 90s soul: vintage Indian matchbox art on refillable jet-flame and flip-top lighters.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#FFC800',
    categories: ['shopping', 'lifestyle'],
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  };
}
