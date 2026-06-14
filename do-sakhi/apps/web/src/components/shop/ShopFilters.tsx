'use client';

import { ShopFilters, CATEGORIES, SIZES, COLOURS, OCCASIONS } from './shop-utils';

interface ShopFiltersProps {
  filters: ShopFilters;
  onFilterChange: (filters: Partial<ShopFilters>) => void;
  onClearAll: () => void;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-7">
      <h3
        className="ds-label mb-3 block"
        style={{ color: '#073F34', letterSpacing: '0.18em', fontSize: '10px' }}
      >
        {title}
      </h3>
      <div
        className="mb-4 h-px ds-copper-line-left"
        style={{ width: '32px', opacity: 0.4 }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

function CheckboxOption({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 py-1.5 group"
    >
      <span
        className="relative flex h-4 w-4 flex-shrink-0 items-center justify-center transition-all"
        style={{
          border: checked ? '1.5px solid #073F34' : '1.5px solid #B8C9BC',
          backgroundColor: checked ? '#073F34' : 'transparent',
        }}
      >
        {checked && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden="true">
            <path d="M1 3.5L3.5 6 8 1" stroke="#F8F3EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
        aria-label={label}
      />
      <span
        className="font-sans text-sm transition-colors group-hover:text-ds-emerald"
        style={{ color: checked ? '#1D1D1B' : '#6E675F', fontWeight: checked ? 500 : 400 }}
      >
        {label}
      </span>
    </label>
  );
}

export default function ShopFiltersPanel({ filters, onFilterChange, onClearAll }: ShopFiltersProps) {
  return (
    <aside
      className="sticky top-[100px] h-fit"
      aria-label="Product filters"
      style={{ minWidth: '200px', maxWidth: '220px' }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="ds-label"
          style={{ color: '#1D1D1B', letterSpacing: '0.20em', fontSize: '11px' }}
        >
          Refine
        </h2>
        <button
          onClick={onClearAll}
          className="font-sans text-xs underline-offset-2 transition-colors hover:underline"
          style={{ color: '#A76F4D', fontSize: '11px' }}
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      </div>

      <div
        className="mb-6 h-px"
        style={{ background: '#E8DED2' }}
        aria-hidden="true"
      />

      {/* Category filter */}
      <FilterSection title="Category">
        <div className="space-y-0.5">
          {CATEGORIES.map((cat) => (
            <CheckboxOption
              key={cat}
              id={`filter-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              label={cat}
              checked={filters.category === cat}
              onChange={(checked) =>
                onFilterChange({ category: checked ? cat : '' })
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Size filter */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() =>
                onFilterChange({ size: filters.size === s ? '' : s })
              }
              className="font-sans text-xs font-medium transition-all"
              style={{
                padding: '5px 10px',
                border: filters.size === s ? '1.5px solid #073F34' : '1px solid #E8DED2',
                color: filters.size === s ? '#073F34' : '#6E675F',
                backgroundColor: filters.size === s ? 'rgba(7,63,52,0.06)' : 'transparent',
                letterSpacing: '0.05em',
              }}
              aria-pressed={filters.size === s}
              aria-label={`Filter by size ${s}`}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Colour filter */}
      <FilterSection title="Colour">
        <div className="space-y-0.5">
          {COLOURS.slice(0, 10).map((col) => (
            <CheckboxOption
              key={col}
              id={`filter-col-${col.replace(/\s+/g, '-').toLowerCase()}`}
              label={col}
              checked={filters.colour === col}
              onChange={(checked) =>
                onFilterChange({ colour: checked ? col : '' })
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Occasion filter */}
      <FilterSection title="Occasion">
        <div className="space-y-0.5">
          {OCCASIONS.map((occ) => (
            <CheckboxOption
              key={occ}
              id={`filter-occ-${occ.replace(/\s+/g, '-').toLowerCase()}`}
              label={occ}
              checked={filters.occasion === occ}
              onChange={(checked) =>
                onFilterChange({ occasion: checked ? occ : '' })
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Custom fit toggle */}
      <FilterSection title="Fit Options">
        <CheckboxOption
          id="filter-custom-fit"
          label="Custom Fit Available"
          checked={filters.customTailoring}
          onChange={(checked) => onFilterChange({ customTailoring: checked })}
        />
        <CheckboxOption
          id="filter-ready-ship"
          label="Ready to Ship"
          checked={filters.availability === 'ready_to_ship'}
          onChange={(checked) =>
            onFilterChange({ availability: checked ? 'ready_to_ship' : '' })
          }
        />
      </FilterSection>

      {/* Price range */}
      <FilterSection title="Price Range">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label htmlFor="filter-min-price" className="sr-only">
              Minimum price
            </label>
            <input
              id="filter-min-price"
              type="number"
              placeholder="Min ₹"
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                onFilterChange({
                  minPrice: e.target.value ? parseInt(e.target.value, 10) : null,
                })
              }
              className="w-full font-sans text-sm focus:outline-none"
              style={{
                border: '1px solid #E8DED2',
                padding: '6px 8px',
                color: '#1D1D1B',
                backgroundColor: '#FFFDF8',
              }}
              min={0}
              aria-label="Minimum price in rupees"
            />
          </div>
          <span style={{ color: '#B8C9BC', fontSize: '12px' }}>–</span>
          <div className="flex-1">
            <label htmlFor="filter-max-price" className="sr-only">
              Maximum price
            </label>
            <input
              id="filter-max-price"
              type="number"
              placeholder="Max ₹"
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                onFilterChange({
                  maxPrice: e.target.value ? parseInt(e.target.value, 10) : null,
                })
              }
              className="w-full font-sans text-sm focus:outline-none"
              style={{
                border: '1px solid #E8DED2',
                padding: '6px 8px',
                color: '#1D1D1B',
                backgroundColor: '#FFFDF8',
              }}
              min={0}
              aria-label="Maximum price in rupees"
            />
          </div>
        </div>
      </FilterSection>
    </aside>
  );
}
