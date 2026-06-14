'use client';

import Link from "next/link";
import { useCart } from "../cart/CartProvider";

/**
 * Header — Step 4.2 Luxury Visual Revamp
 *
 * Refined wordmark presentation. Better spacing. Premium feel.
 * No dropdown logic added. Mobile menu placeholder preserved.
 */
export default function Header() {
  const { toggleCart, items, isHydrated } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md"
      style={{
        background: "rgba(255,253,248,0.88)",
        borderBottom: "1px solid rgba(232,222,210,0.7)",
      }}
    >
      {/* Thin copper top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(167,111,77,0.35) 30%, rgba(167,111,77,0.5) 50%, rgba(167,111,77,0.35) 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">

        {/* Desktop Left Nav */}
        <nav className="hidden items-center space-x-8 md:flex" aria-label="Primary navigation">
          <Link
            href="/shop"
            className="ds-label text-ds-charcoal/75 transition-colors duration-200 hover:text-ds-copper"
          >
            New Arrivals
          </Link>
          <Link
            href="/shop"
            className="ds-label text-ds-charcoal/75 transition-colors duration-200 hover:text-ds-copper"
          >
            Collections
          </Link>
          <Link
            href="/shop"
            className="ds-label text-ds-charcoal/75 transition-colors duration-200 hover:text-ds-copper"
          >
            Lookbooks
          </Link>
          <Link
            href="#bespoke"
            className="ds-label text-ds-charcoal/75 transition-colors duration-200 hover:text-ds-copper"
          >
            Bespoke
          </Link>
        </nav>

        {/* Mobile left — Menu label */}
        <div className="flex md:hidden">
          <button
            aria-label="Open menu"
            className="ds-label text-ds-charcoal/75"
          >
            Menu
          </button>
        </div>

        {/* Center — Wordmark */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link
            href="/"
            aria-label="Do Sakhi — return to homepage"
            className="group flex flex-col items-center gap-0.5"
          >
            <span
              className="font-serif font-light tracking-[-0.02em] text-ds-charcoal transition-opacity duration-200 group-hover:opacity-75"
              style={{ fontSize: "clamp(22px, 3vw, 28px)", lineHeight: 1 }}
            >
              Do Sakhi
            </span>
            <span
              className="ds-label text-ds-copper/70"
              style={{ fontSize: "8px", letterSpacing: "0.25em" }}
            >
              Quiet Luxury
            </span>
          </Link>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-6 md:gap-8">
          <button
            aria-label="Search"
            className="ds-label hidden text-ds-charcoal/75 transition-colors duration-200 hover:text-ds-copper md:block"
          >
            Search
          </button>
          <button
            aria-label="Account"
            className="ds-label hidden text-ds-charcoal/75 transition-colors duration-200 hover:text-ds-copper md:block"
          >
            Account
          </button>
          <button
            onClick={() => toggleCart()}
            aria-label="Shopping cart"
            className="ds-label text-ds-charcoal/75 transition-colors duration-200 hover:text-ds-copper"
          >
            Cart {isHydrated && cartCount > 0 ? `(${cartCount})` : ''}
          </button>
        </div>
      </div>
    </header>
  );
}
