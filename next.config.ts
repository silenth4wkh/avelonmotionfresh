import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

const isDev = process.env.NODE_ENV === 'development';

/* ─── Content Security Policy ───────────────────────────────────────────────
 *
 * 'unsafe-inline' in script-src is required because:
 *   1. Next.js injects inline scripts for hydration bootstrapping
 *   2. JSON-LD structured data uses dangerouslySetInnerHTML
 *
 * TODO (future): Replace 'unsafe-inline' with nonce-based CSP via middleware
 *   – Next.js 15 nonce guide: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
 *
 * 'unsafe-eval' is only enabled in development for webpack HMR (hot reload).
 * Production builds do NOT use eval.
 * ──────────────────────────────────────────────────────────────────────────── */
const ContentSecurityPolicy = [
  // Default: only allow same-origin resources
  "default-src 'self'",

  // Scripts: self + inline (Next.js hydration + JSON-LD)
  // Dev only: unsafe-eval for webpack HMR
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,

  // Styles: Tailwind uses inline styles extensively via style={{}} props
  "style-src 'self' 'unsafe-inline'",

  // Images: self + Cloudinary + Unsplash + data URIs (Next.js image placeholders)
  "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com",

  // Media: hero video + services videos from Cloudinary
  "media-src 'self' https://res.cloudinary.com",

  // Fonts: next/font serves them from /_next/static/ (no external font requests)
  "font-src 'self'",

  // Connections: API calls + Cloudinary image transform requests
  `connect-src 'self' https://res.cloudinary.com${isDev ? ' ws://localhost:* ws://127.0.0.1:*' : ''}`,

  // No iframes allowed
  "frame-src 'none'",

  // Cannot be embedded in another site's iframe (stronger than X-Frame-Options)
  "frame-ancestors 'none'",

  // No Flash, Silverlight, or other plugins
  "object-src 'none'",

  // Prevent base tag hijacking
  "base-uri 'self'",

  // Form submissions only to same origin
  "form-action 'self'",

  // Force HTTPS for all sub-resources in production
  ...(!isDev ? ["upgrade-insecure-requests"] : []),
]
  .filter(Boolean)
  .join('; ');

/* ─── Security headers ───────────────────────────────────────────────────── */
const securityHeaders = [
  // DNS prefetching for performance
  { key: 'X-DNS-Prefetch-Control',   value: 'on' },

  // Prevent MIME type sniffing
  { key: 'X-Content-Type-Options',   value: 'nosniff' },

  // Clickjacking protection (legacy; frame-ancestors CSP is the modern equivalent)
  { key: 'X-Frame-Options',          value: 'DENY' },

  // Legacy XSS filter (kept for older browsers; modern browsers rely on CSP)
  { key: 'X-XSS-Protection',         value: '1; mode=block' },

  // Referrer information sent to external sites
  { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },

  // Disable unnecessary browser features
  { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()' },

  // Content Security Policy
  { key: 'Content-Security-Policy',  value: ContentSecurityPolicy },

  // HSTS: force HTTPS for 2 years — only meaningful in production
  // Remove in dev to avoid breaking localhost HTTP connections
  ...(!isDev
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
    : []),
];

/* ─── Next.js config ─────────────────────────────────────────────────────── */
const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Immutable cache for Next.js static assets (hashed filenames)
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90, 95],
  },
};

export default withNextIntl(nextConfig);
