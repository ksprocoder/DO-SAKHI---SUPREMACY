import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable eslint errors during builds — we run lint separately
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Disable type-check during builds — we run typecheck separately
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow Next.js Image to serve local /public files with optimisation
  images: {
    // Local files from /public are served natively — no remote patterns needed.
    // Explicitly set formats for browser-optimised delivery.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
