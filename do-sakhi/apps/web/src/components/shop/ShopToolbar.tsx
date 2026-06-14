'use client';

import { ShopFilters, SORT_OPTIONS, SortOption, ActiveFilter } from './shop-utils';

interface ShopToolbarProps {
  totalProducts: number;
  filteredCount: number;
  filters: ShopFilters;
  activeFilters: ActiveFilter[];
  onFilterChange: (filters: Partial<ShopFilters>) => void;
  onClearAll: () => void;
  onOpenMobileFilters: () => void;
}

export default function ShopToolbar({
  totalProducts,
  filteredCount,
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  onOpenMobileFilters,
}: ShopToolbarProps) {
  return (
    <div
      className="sticky top-0 z-30 w-full"
      style={{
        backgroundColor: '#FFFDF8',
        borderBottom: '1px solid #E8DED2',
        boxShadow: '0 2px 8px rgba(29,29,27,0.04)',
      }}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex items-center justify-between gap-4 py-4">
          {/* Left: product count + mobile filter button */}
          <div className="flex items-center gap-4">
            {/* Mobile filter toggle */}
            <button
              onClick={onOpenMobileFilters}
              className="md:hidden flex items-center gap-2 text-xs font-medium uppercase tracking-widest transition-colors"
              style={{
                color: '#073F34',
                border: '1px solid #DDE7DC',
                padding: '8px 14px',
              }}
              aria-label="Open filters"
              id="mobile-filter-open"
            >
              <FilterIcon />
              Filters
              {activeFilters.length > 0 && (
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: '#073F34', color: '#F8F3EA' }}
                >
                  {activeFilters.length}
                </span>
              )}
            </button>

            {/* Product count */}
            <p
              className="font-sans text-sm"
              style={{ color: '#6E675F' }}
            >
              Showing{' '}
              <span style={{ color: '#1D1D1B', fontWeight: 500 }}>
                {activeFilters.length > 0 ? `${filteredCount} of ${totalProducts}` : filteredCount}
              </span>{' '}
              piece{filteredCount !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Right: sort dropdown */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="shop-sort"
              className="hidden md:block font-sans text-xs uppercase tracking-widest"
              style={{ color: '#B8C9BC' }}
            >
              Sort
            </label>
            <select
              id="shop-sort"
              value={filters.sort}
              onChange={(e) => onFilterChange({ sort: e.target.value as SortOption })}
              className="appearance-none font-sans text-sm font-medium focus:outline-none cursor-pointer"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #E8DED2',
                color: '#1D1D1B',
                padding: '7px 28px 7px 12px',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236E675F' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filter chips row */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pb-3">
            {activeFilters.map((chip) => (
              <button
                key={`${chip.type}-${chip.value}`}
                onClick={() => {
                  if (chip.type === 'customTailoring') {
                    onFilterChange({ customTailoring: false });
                  } else if (chip.type === 'minPrice') {
                    onFilterChange({ minPrice: null });
                  } else if (chip.type === 'maxPrice') {
                    onFilterChange({ maxPrice: null });
                  } else {
                    onFilterChange({ [chip.type]: '' } as Partial<ShopFilters>);
                  }
                }}
                className="flex items-center gap-1.5 font-sans text-xs transition-all"
                style={{
                  border: '1px solid #DDE7DC',
                  borderRadius: '0',
                  padding: '4px 10px 4px 10px',
                  color: '#073F34',
                  backgroundColor: '#F8F3EA',
                  letterSpacing: '0.06em',
                }}
                aria-label={`Remove filter: ${chip.label}`}
              >
                {chip.label}
                <span style={{ color: '#A76F4D', fontWeight: 600 }}>×</span>
              </button>
            ))}
            <button
              onClick={onClearAll}
              className="font-sans text-xs underline underline-offset-2 transition-colors hover:no-underline"
              style={{ color: '#A76F4D', letterSpacing: '0.06em' }}
              aria-label="Clear all filters"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
      <path d="M1 1h12M3 6h8M5.5 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
