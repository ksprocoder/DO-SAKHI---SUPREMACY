'use client';

import { NormalizedVariant } from './product-utils';

interface SizeSelectorProps {
  variants: NormalizedVariant[];
  selectedVariantId: string | null;
  onSelectVariant: (id: string) => void;
  customTailoringAvailable: boolean;
}

export default function SizeSelector({
  variants,
  selectedVariantId,
  onSelectVariant,
  customTailoringAvailable
}: SizeSelectorProps) {
  if (!variants || variants.length === 0) {
    return (
      <div className="mt-8 mb-6">
        <p className="ds-body text-ds-muted-text">
          {customTailoringAvailable 
            ? 'Size guidance and custom fit support available.' 
            : 'Size guidance available.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center justify-between mb-4">
        <span className="ds-label text-ds-charcoal">Select Size</span>
        <button 
          type="button" 
          className="ds-label text-ds-copper hover:text-ds-charcoal transition-colors underline underline-offset-4"
        >
          Size Guide
        </button>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {variants.map((v) => {
          const isSelected = selectedVariantId === v.id;
          const isOutOfStock = !v.isAvailable;
          
          return (
            <button
              key={v.id}
              onClick={() => {
                if (!isOutOfStock) onSelectVariant(v.id);
              }}
              disabled={isOutOfStock}
              className={`
                relative flex items-center justify-center min-w-[3.5rem] h-12 px-4
                font-sans text-sm tracking-widest transition-all duration-300
                ${isSelected 
                  ? 'bg-ds-charcoal text-ds-ivory border-ds-charcoal' 
                  : 'bg-transparent text-ds-charcoal border-ds-border hover:border-ds-charcoal'}
                ${isOutOfStock ? 'opacity-40 cursor-not-allowed hover:border-ds-border' : 'cursor-pointer'}
                border
              `}
              aria-pressed={isSelected}
              aria-disabled={isOutOfStock}
            >
              {v.size}
              
              {/* Strike-through line for out of stock */}
              {isOutOfStock && (
                <span 
                  className="absolute inset-0 w-full h-[1px] bg-ds-muted-text top-1/2 -translate-y-1/2 -rotate-[20deg]"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
      
      {customTailoringAvailable && (
        <p className="mt-4 ds-label text-ds-muted-text lowercase tracking-widest" style={{ fontSize: '10px' }}>
          * custom fit available for this piece
        </p>
      )}
    </div>
  );
}
