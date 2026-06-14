'use client';

import Link from 'next/link';
import { formatINR } from './cart-utils';
import { useCart } from './CartProvider';

interface CartSummaryProps {
  subtotal: number;
}

export function CartSummary({ subtotal }: CartSummaryProps) {
  const { toggleCart } = useCart();

  const handleCheckoutClick = () => {
    // Close the cart drawer before navigating to checkout
    toggleCart(false);
  };

  return (
    <div className="border-t border-ds-border p-6 bg-ds-ivory">
      <div className="flex justify-between items-center mb-4">
        <span className="font-serif text-lg text-ds-charcoal">Subtotal</span>
        <span className="font-sans text-lg text-ds-charcoal">{formatINR(subtotal)}</span>
      </div>

      <p className="font-sans text-xs text-ds-muted-text mb-6">
        Shipping and final delivery timelines are calculated at checkout.
      </p>

      <div className="flex flex-col gap-3">
        {/* Checkout CTA — routes to /checkout */}
        <Link
          href="/checkout"
          onClick={handleCheckoutClick}
          className="block w-full bg-ds-emerald text-center text-ds-ivory py-4 ds-label tracking-widest hover:bg-ds-deep-forest transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ds-emerald focus-visible:ring-offset-2"
          aria-label="Proceed to checkout review"
        >
          Proceed to Checkout
        </Link>
        <p className="text-center font-sans text-xs text-ds-muted-text">
          Review your details before payment.
        </p>
      </div>
    </div>
  );
}
