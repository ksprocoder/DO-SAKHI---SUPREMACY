'use client';

import Link from 'next/link';

export function CartEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <h3 className="font-serif text-2xl text-ds-charcoal mb-4">
        Your cart is quietly waiting.
      </h3>
      <p className="font-sans text-ds-muted-text mb-8 max-w-[280px]">
        Explore the Do Sakhi edit and add pieces you love.
      </p>
      <Link 
        href="/shop"
        className="bg-ds-emerald text-ds-ivory px-8 py-3 ds-label tracking-widest hover:bg-ds-deep-forest transition-colors duration-300"
      >
        Explore Collection →
      </Link>
    </div>
  );
}
