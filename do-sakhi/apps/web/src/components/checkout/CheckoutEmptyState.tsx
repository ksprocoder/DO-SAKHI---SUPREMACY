'use client';

import Link from 'next/link';

export function CheckoutEmptyState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      {/* Botanical accent */}
      <div className="mb-8 flex items-center gap-3">
        <div className="ds-copper-line-left w-12" />
        <span className="ds-label text-ds-copper/60" style={{ fontSize: '9px', letterSpacing: '0.22em' }}>
          DO SAKHI
        </span>
        <div
          className="h-px w-12 opacity-50"
          style={{ background: 'linear-gradient(90deg, var(--ds-copper) 0%, transparent 100%)' }}
        />
      </div>

      {/* Serif heading */}
      <h1
        className="font-serif font-light text-ds-charcoal"
        style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
      >
        Your checkout is waiting<br className="hidden sm:block" /> for a piece.
      </h1>

      {/* Body */}
      <p className="mt-5 max-w-sm font-sans text-[15px] leading-relaxed text-ds-muted-text">
        Explore the Do Sakhi edit and add something beautiful before continuing.
      </p>

      {/* Copper divider */}
      <div className="ds-copper-line my-8 w-16" />

      {/* CTA */}
      <Link
        href="/shop"
        className="inline-block border border-ds-emerald bg-ds-emerald px-10 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ds-ivory transition-colors duration-300 hover:bg-ds-deep-forest"
      >
        Explore Collection
      </Link>

      {/* Support line */}
      <p className="mt-8 font-sans text-[12px] text-ds-muted-text/70">
        Need help? We are always here to assist you.
      </p>
    </div>
  );
}
