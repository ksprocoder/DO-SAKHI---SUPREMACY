'use client';

import { useEffect, useRef } from 'react';
import { useCart } from './CartProvider';
import { CartLineItem } from './CartLineItem';
import { CartEmptyState } from './CartEmptyState';
import { CartSummary } from './CartSummary';
import { calculateSubtotal } from './cart-utils';

export function CartDrawer() {
  const { isOpen, toggleCart, items, isHydrated, updateQuantity, removeItem } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        toggleCart(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleCart]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!isHydrated) return null; // Avoid SSR hydration mismatch for the drawer content

  const subtotal = calculateSubtotal(items);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-ds-charcoal/40 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => toggleCart(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div 
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-[420px] md:w-[480px] bg-ds-ivory z-[100] flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ds-border">
          <div className="flex flex-col">
            <h2 className="ds-label text-ds-charcoal tracking-widest">YOUR CART</h2>
            {items.length > 0 && (
              <p className="font-serif text-sm text-ds-muted-text italic mt-1">
                Curated pieces selected for you.
              </p>
            )}
          </div>
          <button 
            onClick={() => toggleCart(false)}
            className="p-2 -mr-2 text-ds-charcoal/70 hover:text-ds-charcoal transition-colors"
            aria-label="Close cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 overscroll-contain">
          {items.length === 0 ? (
            <CartEmptyState />
          ) : (
            <div className="flex flex-col pb-8">
              {items.map((item) => (
                <CartLineItem 
                  key={item.cartItemId} 
                  item={item} 
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
              
              <div className="mt-8 p-4 bg-ds-warm-white border border-ds-border flex flex-col gap-2">
                <span className="ds-label text-[10px] text-ds-emerald">BOUTIQUE SERVICE</span>
                <p className="font-serif text-sm text-ds-charcoal">
                  Each piece is carefully inspected and packaged in our signature unboxing experience.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <CartSummary subtotal={subtotal} />
        )}
      </div>
    </>
  );
}
