'use client';

import Link from 'next/link';

interface CheckoutHeaderProps {
  onBackToCart?: () => void;
}

export function CheckoutHeader({ onBackToCart }: CheckoutHeaderProps) {
  return (
    <div className="mb-10">
      {/* Breadcrumb */}
      <nav aria-label="Checkout navigation" className="mb-8 flex items-center gap-2">
        <Link
          href="/shop"
          className="font-sans text-[11px] uppercase tracking-[0.12em] text-ds-muted-text transition-colors duration-200 hover:text-ds-copper"
        >
          Shop
        </Link>
        <span className="font-sans text-[11px] text-ds-border">/</span>
        <button
          type="button"
          onClick={onBackToCart}
          className="font-sans text-[11px] uppercase tracking-[0.12em] text-ds-muted-text transition-colors duration-200 hover:text-ds-copper"
          aria-label="Return to cart"
        >
          Cart
        </button>
        <span className="font-sans text-[11px] text-ds-border">/</span>
        <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-ds-charcoal">
          Review Details
        </span>
      </nav>

      {/* Heading */}
      <div className="flex flex-col gap-2">
        <span
          className="ds-label text-[10px] text-ds-copper/70"
          style={{ letterSpacing: '0.22em' }}
        >
          DO SAKHI — CHECKOUT
        </span>
        <h1
          className="font-serif font-light text-ds-charcoal"
          style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          Your Order Review
        </h1>
        <p className="font-sans text-[14px] text-ds-muted-text mt-1">
          Please complete your details before proceeding to payment.
        </p>
      </div>

      {/* Copper divider */}
      <div className="ds-copper-line mt-6 w-full" />
    </div>
  );
}
