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
            className="flex min-h-[60vh] flex-col items-center justify-center"
            aria-label="Loading shop collection"
          >
            <p
              className="font-sans uppercase text-xs"
              style={{ color: '#A76F4D', letterSpacing: '0.22em', marginBottom: '14px' }}
            >
              Curating the edit
            </p>
            <div
              style={{
                width: '32px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #A76F4D, transparent)',
              }}
              aria-hidden="true"
            />
          </div>
        }
      >
        <ShopClient />
      </Suspense>
    </main>
  );
}
