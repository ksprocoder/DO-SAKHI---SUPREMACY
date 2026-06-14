'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import ShopHero from '@/components/shop/ShopHero';
import ShopToolbar from '@/components/shop/ShopToolbar';
import ShopFiltersPanel from '@/components/shop/ShopFilters';
import MobileFilterDrawer from '@/components/shop/MobileFilterDrawer';
import ProductGrid from '@/components/shop/ProductGrid';
import { ShopLoadingSkeleton, ShopErrorState, ShopEmptyState } from '@/components/shop/ShopStates';
import {
  ShopProduct,
  ShopFilters,
  DEFAULT_FILTERS,
  ActiveFilter,
  SortOption,
  buildActiveFilters,
  filterProducts,
  sortProducts,
  normalizeProduct,
} from '@/components/shop/shop-utils';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:4000/api/v1';

export default function ShopClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── State ──
  const [allProducts, setAllProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const fetchIdRef = useRef(0);

  // ── Read filters from URL on mount ──
  const filtersFromUrl = useCallback((): ShopFilters => {
    return {
      category: searchParams.get('category') || '',
      size: searchParams.get('size') || '',
      colour: searchParams.get('colour') || '',
      fabric: searchParams.get('fabric') || '',
      occasion: searchParams.get('occasion') || '',
      availability: searchParams.get('availability') || '',
      customTailoring: searchParams.get('customTailoring') === 'true',
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : null,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : null,
      sort: (searchParams.get('sort') as SortOption) || 'newest',
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<ShopFilters>(filtersFromUrl());

  // ── Sync filters to URL ──
  const syncToUrl = useCallback(
    (newFilters: ShopFilters) => {
      const params = new URLSearchParams();
      if (newFilters.category) params.set('category', newFilters.category);
      if (newFilters.size) params.set('size', newFilters.size);
      if (newFilters.colour) params.set('colour', newFilters.colour);
      if (newFilters.fabric) params.set('fabric', newFilters.fabric);
      if (newFilters.occasion) params.set('occasion', newFilters.occasion);
      if (newFilters.availability) params.set('availability', newFilters.availability);
      if (newFilters.customTailoring) params.set('customTailoring', 'true');
      if (newFilters.minPrice != null) params.set('minPrice', String(newFilters.minPrice));
      if (newFilters.maxPrice != null) params.set('maxPrice', String(newFilters.maxPrice));
      if (newFilters.sort !== 'newest') params.set('sort', newFilters.sort);

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname]
  );

  const handleFilterChange = useCallback(
    (partial: Partial<ShopFilters>) => {
      setFilters((prev) => {
        const next = { ...prev, ...partial };
        syncToUrl(next);
        return next;
      });
    },
    [syncToUrl]
  );

  const handleClearAll = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  // ── Fetch products from API ──
  const fetchProducts = useCallback(async () => {
    const thisId = ++fetchIdRef.current;
    setLoading(true);
    setError(null);

    try {
      // Fetch all products — filtering is done client-side
      // API only supports: collection, size, fabric, occasion, silhouette, minPrice, maxPrice
      const params = new URLSearchParams({ limit: '100' });
      
      const res = await fetch(`${API_BASE}/products?${params.toString()}`, {
        cache: 'no-store',
      });

      if (thisId !== fetchIdRef.current) return; // Stale response

      if (!res.ok) {
        throw new Error(`API responded with ${res.status}`);
      }

      const json = await res.json();
      
      // Normalize the response defensively
      let raw: any[] = [];
      if (Array.isArray(json)) {
        raw = json;
      } else if (Array.isArray(json?.data)) {
        raw = json.data;
      } else if (json?.products && Array.isArray(json.products)) {
        raw = json.products;
      }

      const normalized = raw.map(normalizeProduct);
      setAllProducts(normalized);
    } catch (err: any) {
      if (thisId !== fetchIdRef.current) return;
      console.error('[Shop] API fetch failed:', err);
      setError('Could not load products. Please try again.');
    } finally {
      if (thisId === fetchIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Apply client-side filters + sort ──
  const displayedProducts = useMemo(() => {
    const filtered = filterProducts(allProducts, filters);
    return sortProducts(filtered, filters.sort);
  }, [allProducts, filters]);

  // ── Active filter chips ──
  const activeFilters: ActiveFilter[] = useMemo(
    () => buildActiveFilters(filters),
    [filters]
  );

  // ── Render ──
  return (
    <>
      {/* Editorial hero header */}
      <ShopHero totalProducts={allProducts.length} loading={loading} />

      {/* Sticky toolbar: sort + count + chips */}
      <ShopToolbar
        totalProducts={allProducts.length}
        filteredCount={displayedProducts.length}
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        onOpenMobileFilters={() => setMobileFiltersOpen(true)}
      />

      {/* Main content: sidebar + grid */}
      <div
        className="mx-auto max-w-7xl px-5 md:px-10"
        style={{ paddingTop: '48px', paddingBottom: '80px' }}
      >
        <div className="flex gap-12">
          {/* Desktop filter sidebar */}
          <div className="hidden md:block flex-shrink-0" style={{ width: '210px' }}>
            <ShopFiltersPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Product area */}
          <div className="min-w-0 flex-1">
            {loading && <ShopLoadingSkeleton />}

            {!loading && error && (
              <ShopErrorState onRetry={fetchProducts} />
            )}

            {!loading && !error && displayedProducts.length === 0 && (
              <ShopEmptyState onClearFilters={handleClearAll} />
            )}

            {!loading && !error && displayedProducts.length > 0 && (
              <ProductGrid products={displayedProducts} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        open={mobileFiltersOpen}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClose={() => setMobileFiltersOpen(false)}
        onClearAll={handleClearAll}
        onApply={() => setMobileFiltersOpen(false)}
      />
    </>
  );
}
