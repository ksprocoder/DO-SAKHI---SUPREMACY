'use client';

import { CartItem } from '../cart/cart-types';
import { CheckoutLineItem } from './CheckoutLineItem';
import { formatINR } from './checkout-utils';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  onContinue: () => void;
  isSubmitting: boolean;
  submitText?: string;
}

export function CheckoutOrderSummary({
  items,
  onContinue,
  isSubmitting,
  submitText,
}: CheckoutOrderSummaryProps) {
  const subtotal = items.reduce((acc, item) => {
    const price =
      typeof item.priceInr === 'number' && !isNaN(item.priceInr) ? item.priceInr : 0;
    const qty = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
    return acc + price * qty;
  }, 0);

  const itemCount = items.reduce((acc, item) => {
    const qty = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
    return acc + qty;
  }, 0);

  return (
    <div className="flex flex-col">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-5">
        <span className="ds-label text-[10px] text-ds-charcoal" style={{ letterSpacing: '0.18em' }}>
          ORDER SUMMARY
        </span>
        <div className="flex-1 ds-copper-line-left" />
        <span className="font-sans text-[12px] text-ds-muted-text">
          {itemCount} {itemCount === 1 ? 'piece' : 'pieces'}
        </span>
      </div>

      {/* Line items */}
      <div className="flex flex-col">
        {items.map((item) => (
          <CheckoutLineItem key={item.cartItemId} item={item} />
        ))}
      </div>

      {/* Pricing summary */}
      <div className="mt-5 flex flex-col gap-2 border-t border-ds-border pt-5">
        <div className="flex justify-between">
          <span className="font-sans text-[14px] text-ds-muted-text">Subtotal</span>
          <span className="font-sans text-[14px] text-ds-charcoal">{formatINR(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-sans text-[14px] text-ds-muted-text">Shipping</span>
          <span className="font-sans text-[13px] text-ds-muted-text/70 italic">
            Calculated at next step
          </span>
        </div>
        <div className="mt-2 flex justify-between border-t border-ds-border pt-3">
          <span className="font-serif text-[17px] text-ds-charcoal">Total</span>
          <div className="text-right">
            <span className="font-sans text-[17px] font-medium text-ds-charcoal">
              {formatINR(subtotal)}
            </span>
            <p className="font-sans text-[11px] text-ds-muted-text/70 mt-0.5">
              Excl. shipping
            </p>
          </div>
        </div>
      </div>

      {/* Shipping note */}
      <p className="mt-3 font-sans text-[12px] text-ds-muted-text leading-relaxed">
        Final shipping and payment options will be confirmed in the next step.
      </p>

      {/* Continue CTA */}
      <div className="mt-6">
        <button
          type="button"
          onClick={onContinue}
          disabled={isSubmitting}
          className="w-full bg-ds-emerald py-4 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ds-ivory transition-all duration-300 hover:bg-ds-deep-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-ds-emerald focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Continue to payment review"
        >
          {submitText ? submitText : isSubmitting ? 'Reviewing your details…' : 'Continue to Payment'}
        </button>

        {/* Microcopy */}
        <p className="mt-2 text-center font-sans text-[11px] text-ds-muted-text">
          Review your details before payment.
        </p>
      </div>

      {/* Trust signals */}
      <div className="mt-6 flex justify-center gap-6">
        {['Secure Review', 'Boutique Care', 'Personal Attention'].map((signal) => (
          <div key={signal} className="flex flex-col items-center gap-1">
            <div className="h-px w-4 bg-ds-copper/40" />
            <span className="ds-label text-[9px] text-ds-muted-text/60" style={{ letterSpacing: '0.12em' }}>
              {signal.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
