import type { Metadata } from 'next';
import { Suspense } from 'react';
import ShopClient from '@/components/shop/ShopClient';

export const metadata: Metadata = {
  title: 'Shop the Edit | Do Sakhi — Quiet Luxury Boutique',
  description:
    'Browse Do Sakhi\'s curated boutique collection of suit sets, co-ords, kurtis and occasion-ready pieces. Quiet luxury, small-batch inventory. Custom fit available.',
};

export default function ShopPage() {
  return (
    <main id="shop-main" aria-label="Shop Collection">
      {/* Suspense boundary required for useSearchParams in Next.js App Router */}
      <Suspense
        fallback={
          <div
            className="flex min-h-[60vh] items-center justify-center"
            aria-label="Loading shop"
          >
            <p
              className="ds-label"
              style={{ color: '#B8C9BC', letterSpacing: '0.2em' }}
            >
              Loading collection…
            </p>
          </div>
        }
      >
        <ShopClient />
      </Suspense>
    </main>
  );
}
