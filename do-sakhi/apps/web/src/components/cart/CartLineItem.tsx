'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CartItem } from './cart-types';
import { formatINR } from './cart-utils';
import { useCart } from './CartProvider';

interface CartLineItemProps {
  item: CartItem;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
}

export function CartLineItem({ item, onUpdateQuantity, onRemove }: CartLineItemProps) {
  const { openTailoring, removeTailoring } = useCart();
  const isMockImage = item.image?.includes('cdn.dosakhi.local');
  const displayImage = isMockImage ? null : item.image;
  const fallbackImg = item.fallbackImage || '/images/editorial/product-1.jpg';

  const measurementsCount = item.tailoringProfile?.measurements 
    ? Object.values(item.tailoringProfile.measurements).filter(v => v !== undefined && v !== '').length 
    : 0;

  return (
    <div className="flex gap-4 py-6 border-b border-ds-border last:border-b-0">
      {/* Image */}
      <Link href={`/product/${item.slug}`} className="shrink-0">
        <div className="relative w-24 h-[120px] bg-ds-warm-white overflow-hidden">
          <Image
            src={displayImage || fallbackImg}
            alt={item.title}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="96px"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          <div className="flex justify-between items-start gap-4">
            <Link href={`/product/${item.slug}`} className="hover:text-ds-copper transition-colors duration-200">
              <h4 className="font-serif text-lg text-ds-charcoal leading-tight">
                {item.title}
              </h4>
            </Link>
            <button 
              onClick={() => onRemove(item.cartItemId)}
              className="text-xs font-sans text-ds-muted-text hover:text-ds-charcoal transition-colors uppercase tracking-wider"
              aria-label={`Remove ${item.title} from cart`}
            >
              Remove
            </button>
          </div>
          
          <div className="mt-1 flex flex-col gap-0.5">
            {item.colour && (
              <p className="font-sans text-xs text-ds-muted-text">
                <span className="text-ds-charcoal mr-1">Colour:</span>{item.colour}
              </p>
            )}
            {item.sizeLabel && (
              <p className="font-sans text-xs text-ds-muted-text">
                <span className="text-ds-charcoal mr-1">Size:</span>{item.sizeLabel}
              </p>
            )}
            {item.customTailoringSelected && item.tailoringProfile ? (
              <div className="mt-2 bg-ds-emerald/5 border border-ds-emerald/20 p-2 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <span className="font-sans text-[10px] text-ds-emerald uppercase tracking-widest">Custom Fit Added</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openTailoring(item.cartItemId)}
                      className="text-[10px] font-sans text-ds-charcoal hover:text-ds-copper uppercase tracking-widest underline decoration-ds-border underline-offset-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Are you sure you want to remove custom fit details?')) {
                          removeTailoring(item.cartItemId);
                        }
                      }}
                      className="text-[10px] font-sans text-ds-muted-text hover:text-ds-charcoal uppercase tracking-widest"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-sans text-xs text-ds-charcoal mt-1 capitalize">
                  {item.tailoringProfile.fitProfile.replace(/_/g, ' ')}
                </p>
                <p className="font-sans text-[10px] text-ds-muted-text">
                  {measurementsCount} measurements shared
                  {item.tailoringProfile.notes && ' • Notes added'}
                </p>
              </div>
            ) : item.customTailoringAvailable ? (
              <button 
                onClick={() => openTailoring(item.cartItemId)}
                className="mt-2 text-left w-fit font-sans text-xs text-ds-charcoal hover:text-ds-copper transition-colors uppercase tracking-widest border-b border-ds-charcoal hover:border-ds-copper pb-0.5"
              >
                + Add Custom Fit
              </button>
            ) : (
              <p className="font-sans text-[10px] text-ds-muted-text mt-2 italic">
                Standard size guidance available.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div className="flex items-center border border-ds-border">
            <button 
              className="px-3 py-1 text-ds-charcoal hover:bg-ds-warm-white transition-colors disabled:opacity-50"
              onClick={() => {
                if (item.quantity > 1) {
                  onUpdateQuantity(item.cartItemId, item.quantity - 1);
                }
              }}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-2 font-sans text-sm min-w-[2rem] text-center">{item.quantity}</span>
            <button 
              className="px-3 py-1 text-ds-charcoal hover:bg-ds-warm-white transition-colors disabled:opacity-50"
              onClick={() => {
                const max = item.maxQuantity;
                if (max === undefined || item.quantity < max) {
                  onUpdateQuantity(item.cartItemId, item.quantity + 1);
                }
              }}
              disabled={item.maxQuantity !== undefined && item.quantity >= item.maxQuantity}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          
          <span className="font-sans text-sm text-ds-charcoal">
            {formatINR(item.priceInr * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
