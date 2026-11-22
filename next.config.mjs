import { FR_PATHS } from './lib/routes.js';

const frPaths = Object.entries(FR_PATHS); // [internal English path, French address]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // French pages have French addresses: /fr/about → /fr/a-propos (query strings, e.g. cancel tokens, are kept).
      ...frPaths.map(([internal, fr]) => ({ source: `/fr${internal}`, destination: `/fr${fr}`, permanent: true })),
      // A French address with the English prefix: /en/a-propos → /en/about.
      ...frPaths.map(([internal, fr]) => ({ source: `/en${fr}`, destination: `/en${internal}`, permanent: true })),
      // "Our approach" is now part of the About page.
      { source: '/en/approach', destination: '/en/about', permanent: true },
      { source: '/fr/approach', destination: `/fr${FR_PATHS['/about']}`, permanent: true },
      { source: '/approach', destination: '/about', permanent: true },
    ];
  },
  async rewrites() {
    return {
      // Serve each French address from its page (which lives at the English path).
      beforeFiles: frPaths.map(([internal, fr]) => ({ source: `/fr${fr}`, destination: `/fr${internal}` })),
    };
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
