// ─── Shop Utilities ────────────────────────────────────────────────────────────

/**
 * Normalized product type for the shop page.
 * The API returns ProductSummary, but we augment it defensively.
 */
export interface ShopProduct {
  id: string;
  slug: string | null;
  title: string;
  price: number | null;
  fabric: string | null;
  silhouette: string | null;
  product_type: string | null;
  colour: string | null;
  available_sizes: string[] | null;
  image: string | null;
  hover_image: string | null;
  custom_tailoring_available?: boolean;
  is_ready_to_ship?: boolean;
  is_featured?: boolean;
}

export interface ActiveFilter {
  type: string;
  value: string;
  label: string;
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name_az';

export interface ShopFilters {
  category: string;
  size: string;
  colour: string;
  fabric: string;
  occasion: string;
  availability: string;
  customTailoring: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  sort: SortOption;
}

export const DEFAULT_FILTERS: ShopFilters = {
  category: '',
  size: '',
  colour: '',
  fabric: '',
  occasion: '',
  availability: '',
  customTailoring: false,
  minPrice: null,
  maxPrice: null,
  sort: 'newest',
};

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_az', label: 'Name: A to Z' },
];

export const CATEGORIES = [
  'Suit Set',
  'Co-ord Set',
  '3 Piece Co-ord Set',
  'Kurti',
  'Lehenga',
  'Saree',
  'Gown',
  'Jacket / Overlay',
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];

export const COLOURS = [
  'Black', 'White', 'Ivory', 'Maroon', 'Green', 'Pista Green', 'Peach',
  'Yellow', 'Cherry', 'Mustard', 'White Brown', 'White Jute', 'Blue',
  'Pink', 'Rust', 'Beige', 'Navy',
];

export const OCCASIONS = [
  'Daily Wear', 'Office', 'Small Gathering', 'Festive', 'Travel', 'Casual Luxury',
];

// ── Local editorial fallback images (from /images/editorial/)
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

/** Deterministically pick a fallback image by product index */
export function getFallbackImage(index: number): string {
  return EDITORIAL_FALLBACKS[index % EDITORIAL_FALLBACKS.length];
}

/** Returns true if the URL is a real, safe image URL */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  if (url.includes('cdn.dosakhi.local')) return false;
  if (url.includes('placeholder')) return false;
  if (!url.startsWith('/') && !url.startsWith('http')) return false;
  return true;
}

/** Format a price as INR */
export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined || price === '') return 'Price on request';
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return 'Price on request';
  return `₹${Math.round(num).toLocaleString('en-IN')}`;
}

/** Format a snake_case or SCREAMING_SNAKE_CASE enum to Title Case */
export function formatEnum(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/** Normalize a raw API product into a ShopProduct */
export function normalizeProduct(raw: any): ShopProduct {
  return {
    id: raw.id || '',
    slug: raw.slug || null,
    title: raw.title || 'Untitled Boutique Piece',
    price: raw.price != null ? parseFloat(raw.price) : null,
    fabric: raw.fabric || raw.fabric_composition || null,
    silhouette: raw.silhouette || null,
    product_type: raw.product_type?.toLowerCase() || null,
    colour: raw.colour || raw.color_name || null,
    available_sizes: Array.isArray(raw.available_sizes) ? raw.available_sizes : null,
    image: raw.image || raw.thumbnail || null,
    hover_image: raw.hover_image || null,
    custom_tailoring_available: !!raw.custom_tailoring_available,
    is_ready_to_ship: raw.is_ready_to_ship !== false,
    is_featured: !!raw.is_featured,
  };
}

/** Sort products client-side */
export function sortProducts(products: ShopProduct[], sort: SortOption): ShopProduct[] {
  const copy = [...products];
  switch (sort) {
    case 'price_asc':
      return copy.sort((a, b) => {
        const pa = a.price ?? Infinity;
        const pb = b.price ?? Infinity;
        return pa - pb;
      });
    case 'price_desc':
      return copy.sort((a, b) => {
        const pa = a.price ?? -Infinity;
        const pb = b.price ?? -Infinity;
        return pb - pa;
      });
    case 'name_az':
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case 'newest':
    default:
      return copy; // API already returns newest first
  }
}

/** Filter products client-side (for filters not yet supported by API) */
export function filterProducts(products: ShopProduct[], filters: ShopFilters): ShopProduct[] {
  return products.filter((p) => {
    if (filters.category) {
      const dbType = filters.category.replace(/\s+/g, '_').toLowerCase();
      if (p.product_type !== dbType) return false;
    }
    if (filters.size && !p.available_sizes?.includes(filters.size)) return false;
    if (filters.colour && !p.colour?.toLowerCase().includes(filters.colour.toLowerCase())) return false;
    if (filters.customTailoring && !p.custom_tailoring_available) return false;
    if (filters.availability === 'ready_to_ship' && !p.is_ready_to_ship) return false;
    if (filters.minPrice != null && (p.price ?? 0) < filters.minPrice) return false;
    if (filters.maxPrice != null && (p.price ?? Infinity) > filters.maxPrice) return false;
    return true;
  });
}

/** Build active filter chips from current filter state */
export function buildActiveFilters(filters: ShopFilters): ActiveFilter[] {
  const chips: ActiveFilter[] = [];
  if (filters.category) chips.push({ type: 'category', value: filters.category, label: filters.category });
  if (filters.size) chips.push({ type: 'size', value: filters.size, label: `Size: ${filters.size}` });
  if (filters.colour) chips.push({ type: 'colour', value: filters.colour, label: filters.colour });
  if (filters.fabric) chips.push({ type: 'fabric', value: filters.fabric, label: `Fabric: ${filters.fabric}` });
  if (filters.occasion) chips.push({ type: 'occasion', value: filters.occasion, label: filters.occasion });
  if (filters.availability) chips.push({ type: 'availability', value: filters.availability, label: 'Ready to Ship' });
  if (filters.customTailoring) chips.push({ type: 'customTailoring', value: 'true', label: 'Custom Fit' });
  if (filters.minPrice != null) chips.push({ type: 'minPrice', value: String(filters.minPrice), label: `From ₹${filters.minPrice.toLocaleString('en-IN')}` });
  if (filters.maxPrice != null) chips.push({ type: 'maxPrice', value: String(filters.maxPrice), label: `Up to ₹${filters.maxPrice.toLocaleString('en-IN')}` });
  return chips;
}
