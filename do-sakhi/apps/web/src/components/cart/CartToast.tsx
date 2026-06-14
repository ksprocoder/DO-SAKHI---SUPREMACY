'use client';

import { useEffect, useState } from 'react';
import { useCart } from './CartProvider';

export function CartToast() {
  const { items } = useCart();
  const [show, setShow] = useState(false);
  const [lastAddedName, setLastAddedName] = useState<string | null>(null);

  useEffect(() => {
    // Only trigger if items array length increases or an item's quantity increases.
    // For a simple toast, we'll watch the items array reference changes and show it if the cart isn't open.
    // Actually, to make it truly micro-feedback, we can just export a function from Context or
    // simply watch the most recently added item.
    // Given the simplicity requested, we'll build a lightweight mechanism:
    
    if (items.length > 0) {
      const latestItem = items[items.length - 1]; // Approximation
      setLastAddedName(latestItem.title);
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [items]);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-[110] bg-ds-ivory border border-ds-emerald/30 shadow-xl px-4 py-3 flex items-center gap-3 transition-all duration-300 transform ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
      role="status"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-ds-emerald shrink-0"></div>
      <p className="font-sans text-sm text-ds-charcoal">
        <span className="font-medium mr-1">Added to Cart</span>
        {lastAddedName && <span className="text-ds-muted-text hidden sm:inline">— {lastAddedName}</span>}
      </p>
    </div>
  );
}
