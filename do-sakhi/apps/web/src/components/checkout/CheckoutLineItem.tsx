'use client';

import Image from 'next/image';
import { CartItem } from '../cart/cart-types';
import { formatINR, isSafeImageUrl } from './checkout-utils';
import { CustomFitSummary } from './CustomFitSummary';

interface CheckoutLineItemProps {
  item: CartItem;
}

function ProductImage({ item }: { item: CartItem }) {
  const src = isSafeImageUrl(item.image)
    ? item.image!
    : isSafeImageUrl(item.fallbackImage)
    ? item.fallbackImage!
    : null;

  if (src) {
    return (
      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-sm bg-ds-soft-sage/30">
        <Image
          src={src}
          alt={item.title || 'Boutique piece'}
          fill
          className="object-cover object-top"
          sizes="64px"
        />
      </div>
    );
  }

  // Premium fallback — no broken icon
  return (
    <div className="ds-product-fallback h-20 w-16 flex-shrink-0 rounded-sm">
      <div className="flex h-full items-center justify-center">
        <span
          className="font-serif text-[10px] italic text-ds-muted-text/60"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Do Sakhi
        </span>
      </div>
    </div>
  );
}

export function CheckoutLineItem({ item }: CheckoutLineItemProps) {
  const title = item.title?.trim() || 'Boutique Piece';
  const price = typeof item.priceInr === 'number' && !isNaN(item.priceInr) ? item.priceInr : null;
  const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
  const lineTotal = price !== null ? price * quantity : null;
  const sizeLabel = item.sizeLabel?.trim() || null;
  const colour = item.colour?.trim() || null;

  return (
    <div className="flex gap-4 py-4 border-b border-ds-border last:border-0">
      <ProductImage item={item} />

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        {/* Title + price row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-[15px] leading-snug text-ds-charcoal line-clamp-2">
            {title}
          </h3>
          <span className="font-sans text-[14px] font-medium text-ds-charcoal flex-shrink-0">
            {lineTotal !== null ? formatINR(lineTotal) : 'Price on request'}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {sizeLabel && (
            <span className="ds-label text-[10px] text-ds-muted-text">
              Size: {sizeLabel}
            </span>
          )}
          {colour && (
            <span className="ds-label text-[10px] text-ds-muted-text">
              {colour}
            </span>
          )}
          {quantity > 1 && (
            <span className="ds-label text-[10px] text-ds-muted-text">
              Qty: {quantity}
            </span>
          )}
          {price !== null && quantity > 1 && (
            <span className="ds-label text-[10px] text-ds-muted-text">
              {formatINR(price)} each
            </span>
          )}
        </div>

        {/* Custom fit section */}
        {item.tailoringProfile && item.tailoringProfile.enabled ? (
          <CustomFitSummary profile={item.tailoringProfile} />
        ) : item.customTailoringAvailable ? (
          <p className="mt-1 font-sans text-[11px] text-ds-muted-text/70 italic">
            No custom fit details added
          </p>
        ) : (
          <p className="mt-1 font-sans text-[11px] text-ds-muted-text/70">
            Standard size selected
          </p>
        )}
      </div>
    </div>
  );
}
