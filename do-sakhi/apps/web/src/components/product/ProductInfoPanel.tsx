'use client';

import { useState, useEffect } from 'react';
import { ProductDetail } from '@/lib/types';
import SizeSelector from './SizeSelector';
import ProductDetailsAccordion from './ProductDetailsAccordion';
import BoutiqueReassurance from './BoutiqueReassurance';
import { useCart } from '../cart/CartProvider';
import {
  normalizeVariant,
  getDisplayPrice,
  getAvailabilityInfo,
  getProductColour,
  getProductType,
  getLeadTime,
  getSafeMedia
} from './product-utils';

interface ProductInfoPanelProps {
  product: ProductDetail;
}

export default function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, toggleCart } = useCart();

  const variants = product.variants ? product.variants.map(normalizeVariant) : [];
  const displayPrice = getDisplayPrice(variants, selectedVariantId || undefined);
  const availability = getAvailabilityInfo(product);
  const colour = getProductColour(product);
  const type = getProductType(product);
  const leadTime = getLeadTime(product);
  const safeMedia = product.media ? getSafeMedia(product.media) : [];

  const selectedVariant = variants.find(v => v.id === selectedVariantId);
  const isOutOfStock = selectedVariant && selectedVariant.stock <= 0;

  useEffect(() => {
    if (isAdded) {
      const timer = setTimeout(() => setIsAdded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAdded, selectedVariantId]);

  const handleSelectSize = (variantId: string) => {
    setSelectedVariantId(variantId);
    setIsAdded(false);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      slug: product.slug,
      title: product.title || 'Boutique Piece',
      productType: type,
      image: safeMedia[0]?.url,
      fallbackImage: '/images/editorial/product-1.jpg',
      colour: colour,
      sizeLabel: selectedVariant.size,
      sizeNumeric: undefined, // NormalizedVariant does not map this
      priceInr: selectedVariant.price || 0,
      quantity: 1,
      maxQuantity: selectedVariant.stock,
      customTailoringAvailable: product.custom_tailoring_available,
      customTailoringSelected: false,
    });
    
    setIsAdded(true);
  };

  const getButtonText = () => {
    if (variants.length === 0) return 'Size Guidance Available';
    if (!selectedVariantId) return 'Select Size to Continue';
    if (isOutOfStock) return 'Currently Unavailable';
    if (isAdded) return 'Added to Cart';
    return 'Add to Cart';
  };

  const isButtonDisabled = variants.length === 0 || !selectedVariantId || isOutOfStock;

  return (
    <div className="flex flex-col h-full sticky top-32">
      {/* ── Badges ── */}
      <div className="flex flex-wrap gap-2 mb-4">
        {product.ribbon_label && (
          <span className="ds-label bg-[#A76F4D]/10 text-ds-copper px-3 py-1 text-[9px]">
            {product.ribbon_label}
          </span>
        )}
        {product.custom_tailoring_available && (
          <span className="ds-label bg-[#073F34]/90 text-[#DDE7DC] px-3 py-1 text-[9px]">
            CUSTOM FIT
          </span>
        )}
        {(product as any).is_ready_to_ship && (
          <span className="ds-label bg-[#022B24]/85 text-[#B8C9BC] px-3 py-1 text-[9px]">
            READY TO SHIP
          </span>
        )}
      </div>

      {/* ── Title & Price ── */}
      <h1 className="font-serif text-3xl md:text-4xl lg:text-[42px] leading-[1.1] text-ds-charcoal mb-2">
        {product.title || 'Boutique Piece'}
      </h1>
      
      <p className="ds-label text-ds-copper mb-6 tracking-[0.2em]">{type}</p>

      <div className="font-sans text-xl text-ds-charcoal mb-6">
        {displayPrice}
      </div>

      {/* ── Meta Info ── */}
      <div className="flex flex-col gap-2 mb-8 border-b border-ds-border pb-6">
        <p className="font-sans text-sm text-ds-muted-text">
          <span className="text-ds-charcoal font-medium mr-2">Colour:</span>
          {colour}
        </p>
        
        <p className="font-sans text-sm text-ds-muted-text flex items-center gap-2">
          <span className="w-2 h-2 rounded-full block" style={{ backgroundColor: availability.colour }}></span>
          {availability.label}
        </p>

        {leadTime && (
          <p className="font-sans text-sm text-ds-muted-text">
            <span className="text-ds-charcoal font-medium mr-2">Lead Time:</span>
            {leadTime}
          </p>
        )}
      </div>

      {/* ── Size Selector ── */}
      <SizeSelector 
        variants={variants}
        selectedVariantId={selectedVariantId}
        onSelectVariant={handleSelectSize}
        customTailoringAvailable={product.custom_tailoring_available}
      />

      {/* ── CTAs ── */}
      <div className="flex flex-col gap-3 mt-4">
        <button 
          onClick={handleAddToCart}
          className="w-full bg-ds-emerald text-ds-ivory py-4 ds-label tracking-widest hover:bg-ds-deep-forest transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isButtonDisabled}
        >
          {getButtonText()}
        </button>
        <p className="text-center font-sans text-xs text-ds-muted-text mt-2">
          Checkout flow will be activated in the next milestone.
        </p>
      </div>

      <BoutiqueReassurance />

      <ProductDetailsAccordion product={product} />

    </div>
  );
}
