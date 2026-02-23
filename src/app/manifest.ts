import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AlephStart — Learn to Read Hebrew',
    short_name: 'AlephStart',
    description:
      'Learn to read Hebrew and daven with confidence. From the Aleph-Bet to the Siddur.',
    start_url: '/',
    display: 'standalone',
    background_color: 'var(--background)',
    theme_color: 'var(--primary)',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
