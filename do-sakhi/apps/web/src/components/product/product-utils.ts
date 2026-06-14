// ─── Product Detail Page Utilities ─────────────────────────────────────────
// Shared helpers for the PDP. Mirrors the shop-utils pattern.

import { ProductDetail, ProductMedia, ProductVariant } from '@/lib/types';

// ── Editorial fallback images (same pool as shop) ──────────────────────────
export const EDITORIAL_FALLBACKS = [
  '/images/editorial/product-1.jpg',
  '/images/editorial/product-2.jpg',
  '/images/editorial/product-3.jpg',
  '/images/editorial/product-4.jpg',
  '/images/editorial/hero-cream-coord.jpg',
  '/images/editorial/kurti-rosegold.jpg',
  '/images/editorial/collection-coords.jpg',
  '/images/editorial/suit-black.jpg',
  '/images/editorial/collection-suits.jpg',
  '/images/editorial/collection-festive.jpg',
];

/** Deterministically pick a fallback image by seed */
export function getFallbackImage(seed: number = 0): string {
  return EDITORIAL_FALLBACKS[Math.abs(seed) % EDITORIAL_FALLBACKS.length];
}

/** Returns true if the URL is a safe, usable image URL */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  if (url.includes('cdn.dosakhi.local')) return false;
  if (url.includes('placeholder')) return false;
  if (!url.startsWith('/') && !url.startsWith('http')) return false;
  return true;
}

// ── Media Role Sort Order ────────────────────────────────────────────────────
const MEDIA_ROLE_ORDER: Record<string, number> = {
  front: 0,
  side: 1,
  back: 2,
  fabric_closeup: 3,
  detail: 4,
  lifestyle: 5,
  fallback: 99,
};

/** Sort media array by editorial role priority */
export function sortMedia(media: ProductMedia[]): ProductMedia[] {
  return [...media].sort((a, b) => {
    const ao = MEDIA_ROLE_ORDER[a.media_role] ?? 50;
    const bo = MEDIA_ROLE_ORDER[b.media_role] ?? 50;
    if (ao !== bo) return ao - bo;
    return a.position - b.position;
  });
}

/** Filter out invalid/fake CDN URLs from a media array */
export function getSafeMedia(media: ProductMedia[]): ProductMedia[] {
  return sortMedia(media).filter((m) => isValidImageUrl(m.url));
}

// ── Price Formatting ────────────────────────────────────────────────────────

/** Format a price as INR. Does NOT divide by 100 (Step 5C fix preserved). */
export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined || price === '') return 'Price on request';
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return 'Price on request';
  return `₹${Math.round(num).toLocaleString('en-IN')}`;
}

// ── Variant / Size Utilities ────────────────────────────────────────────────

export interface NormalizedVariant {
  id: string;
  size: string;
  price: number | null;
  stock: number;
  isAvailable: boolean;
}

/** Normalize a raw ProductVariant into a clean NormalizedVariant */
export function normalizeVariant(v: ProductVariant): NormalizedVariant {
  const price =
    v.price_inr != null && v.price_inr !== ''
      ? parseFloat(String(v.price_inr))
      : null;
  const stock = Math.max(0, (v.stock_quantity || 0) - (v.reserved_quantity || 0));
  return {
    id: v.id,
    size: v.size_label || 'One Size',
    price: price && !isNaN(price) ? price : null,
    stock,
    isAvailable: v.is_active && stock > 0,
  };
}

/** Get display price — from variants, or fallback */
export function getDisplayPrice(variants: NormalizedVariant[], selectedVariantId?: string): string {
  if (variants.length === 0) return 'Price on request';

  if (selectedVariantId) {
    const selected = variants.find((v) => v.id === selectedVariantId);
    if (selected?.price != null) return formatPrice(selected.price);
  }

  const prices = variants.map((v) => v.price).filter((p): p is number => p != null);
  if (prices.length === 0) return 'Price on request';

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (min === max) return formatPrice(min);
  return `From ${formatPrice(min)}`;
}

// ── Availability Messaging ──────────────────────────────────────────────────

export interface AvailabilityInfo {
  label: string;
  colour: string;
}

export function getAvailabilityInfo(product: ProductDetail): AvailabilityInfo {
  const totalStock = product.stockAvailable ?? 0;

  if (totalStock === 0) {
    return { label: 'Currently unavailable', colour: '#8A2F24' };
  }
  if (totalStock <= 3) {
    return { label: 'Only a few pieces left', colour: '#A76F4D' };
  }
  // Cast to any to handle fields that may exist in runtime but not in current type
  const p = product as any;
  if (p.is_ready_to_ship) {
    return { label: 'Ready to ship', colour: '#315C48' };
  }
  if (p.is_made_to_order) {
    return { label: 'Made to order', colour: '#073F34' };
  }
  if (product.custom_tailoring_available) {
    return { label: 'Custom fit guidance available', colour: '#073F34' };
  }
  return { label: 'Available', colour: '#315C48' };
}

// ── Defensive Field Accessors ───────────────────────────────────────────────

/** Access any extended field from product, with typed fallback */
export function safeField(product: ProductDetail, field: string, fallback: string): string {
  const val = (product as any)[field];
  if (val === null || val === undefined || val === '') return fallback;
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  return String(val);
}

/** Get colour from product (not in current type but may exist at runtime) */
export function getProductColour(product: ProductDetail): string {
  const p = product as any;
  return p.colour || p.color_name || p.color || 'As Shown';
}

/** Get product type display label */
export function getProductType(product: ProductDetail): string {
  const p = product as any;
  return p.product_type || p.silhouette || product.silhouette || 'Boutique edit';
}

/** Get lead time string */
export function getLeadTime(product: ProductDetail): string | null {
  const min = product.lead_time_min_days;
  const max = product.lead_time_max_days;
  if (!min && !max) return null;
  if (min === max) return `${min} days`;
  return `${min}–${max} days`;
}
