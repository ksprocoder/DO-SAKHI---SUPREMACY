'use client';

import { useEffect } from 'react';
import { ShopFilters, CATEGORIES, SIZES, COLOURS, OCCASIONS } from './shop-utils';

interface MobileFilterDrawerProps {
  open: boolean;
  filters: ShopFilters;
  onFilterChange: (filters: Partial<ShopFilters>) => void;
  onClose: () => void;
  onClearAll: () => void;
  onApply: () => void;
}

export default function MobileFilterDrawer({
  open,
  filters,
  onFilterChange,
  onClose,
  onClearAll,
  onApply,
}: MobileFilterDrawerProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(7,63,52,0.45)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Product filters"
        className="fixed bottom-0 left-0 right-0 z-50 overflow-y-auto"
        style={{
          backgroundColor: '#FFFDF8',
          maxHeight: '88vh',
          borderTop: '2px solid #E8DED2',
          boxShadow: '0 -8px 40px rgba(2,43,36,0.18)',
        }}
      >
        {/* Drawer handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div
            style={{
              width: '40px',
              height: '3px',
              backgroundColor: '#B8C9BC',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pb-4 pt-3"
          style={{ borderBottom: '1px solid #E8DED2' }}
        >
          <h2
            className="ds-label"
            style={{ color: '#073F34', letterSpacing: '0.2em', fontSize: '11px' }}
          >
            Refine Collection
          </h2>
          <button
            onClick={onClose}
            aria-label="Close filter drawer"
            className="font-sans text-sm transition-colors"
            style={{ color: '#6E675F' }}
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-5 space-y-7">
          {/* Category */}
          <div>
            <h3
              className="ds-label mb-3"
              style={{ color: '#073F34', letterSpacing: '0.16em', fontSize: '10px' }}
            >
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onFilterChange({ category: filters.category === cat ? '' : cat })}
                  className="font-sans text-xs transition-all"
                  style={{
                    padding: '6px 12px',
                    border: filters.category === cat ? '1.5px solid #073F34' : '1px solid #E8DED2',
                    color: filters.category === cat ? '#073F34' : '#6E675F',
                    backgroundColor: filters.category === cat ? 'rgba(7,63,52,0.07)' : 'transparent',
                  }}
                  aria-pressed={filters.category === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <h3
              className="ds-label mb-3"
              style={{ color: '#073F34', letterSpacing: '0.16em', fontSize: '10px' }}
            >
              Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => onFilterChange({ size: filters.size === s ? '' : s })}
                  className="font-sans text-xs font-medium transition-all"
                  style={{
                    padding: '6px 12px',
                    border: filters.size === s ? '1.5px solid #073F34' : '1px solid #E8DED2',
                    color: filters.size === s ? '#073F34' : '#6E675F',
                    backgroundColor: filters.size === s ? 'rgba(7,63,52,0.07)' : 'transparent',
                  }}
                  aria-pressed={filters.size === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Colour */}
          <div>
            <h3
              className="ds-label mb-3"
              style={{ color: '#073F34', letterSpacing: '0.16em', fontSize: '10px' }}
            >
              Colour
            </h3>
            <div className="flex flex-wrap gap-2">
              {COLOURS.slice(0, 12).map((col) => (
                <button
                  key={col}
                  onClick={() => onFilterChange({ colour: filters.colour === col ? '' : col })}
                  className="font-sans text-xs transition-all"
                  style={{
                    padding: '5px 10px',
                    border: filters.colour === col ? '1.5px solid #073F34' : '1px solid #E8DED2',
                    color: filters.colour === col ? '#073F34' : '#6E675F',
                    backgroundColor: filters.colour === col ? 'rgba(7,63,52,0.07)' : 'transparent',
                  }}
                  aria-pressed={filters.colour === col}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {/* Occasion */}
          <div>
            <h3
              className="ds-label mb-3"
              style={{ color: '#073F34', letterSpacing: '0.16em', fontSize: '10px' }}
            >
              Occasion
            </h3>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ}
                  onClick={() => onFilterChange({ occasion: filters.occasion === occ ? '' : occ })}
                  className="font-sans text-xs transition-all"
                  style={{
                    padding: '5px 10px',
                    border: filters.occasion === occ ? '1.5px solid #073F34' : '1px solid #E8DED2',
                    color: filters.occasion === occ ? '#073F34' : '#6E675F',
                    backgroundColor: filters.occasion === occ ? 'rgba(7,63,52,0.07)' : 'transparent',
                  }}
                  aria-pressed={filters.occasion === occ}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Fit options */}
          <div>
            <h3
              className="ds-label mb-3"
              style={{ color: '#073F34', letterSpacing: '0.16em', fontSize: '10px' }}
            >
              Fit & Availability
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onFilterChange({ customTailoring: !filters.customTailoring })}
                className="font-sans text-xs transition-all"
                style={{
                  padding: '5px 10px',
                  border: filters.customTailoring ? '1.5px solid #073F34' : '1px solid #E8DED2',
                  color: filters.customTailoring ? '#073F34' : '#6E675F',
                  backgroundColor: filters.customTailoring ? 'rgba(7,63,52,0.07)' : 'transparent',
                }}
                aria-pressed={filters.customTailoring}
              >
                Custom Fit
              </button>
              <button
                onClick={() =>
                  onFilterChange({
                    availability: filters.availability === 'ready_to_ship' ? '' : 'ready_to_ship',
                  })
                }
                className="font-sans text-xs transition-all"
                style={{
                  padding: '5px 10px',
                  border: filters.availability === 'ready_to_ship' ? '1.5px solid #073F34' : '1px solid #E8DED2',
                  color: filters.availability === 'ready_to_ship' ? '#073F34' : '#6E675F',
                  backgroundColor:
                    filters.availability === 'ready_to_ship' ? 'rgba(7,63,52,0.07)' : 'transparent',
                }}
                aria-pressed={filters.availability === 'ready_to_ship'}
              >
                Ready to Ship
              </button>
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div
          className="sticky bottom-0 flex gap-3 p-5"
          style={{
            backgroundColor: '#FFFDF8',
            borderTop: '1px solid #E8DED2',
          }}
        >
          <button
            onClick={() => { onClearAll(); onClose(); }}
            className="flex-1 font-sans text-sm font-medium uppercase tracking-widest transition-colors"
            style={{
              border: '1px solid #E8DED2',
              color: '#6E675F',
              padding: '13px',
              letterSpacing: '0.12em',
              fontSize: '11px',
            }}
            aria-label="Clear all filters"
          >
            Clear All
          </button>
          <button
            onClick={() => { onApply(); onClose(); }}
            className="flex-[2] font-sans text-sm font-medium uppercase tracking-widest transition-all"
            style={{
              backgroundColor: '#073F34',
              color: '#F8F3EA',
              padding: '13px',
              letterSpacing: '0.12em',
              fontSize: '11px',
            }}
            aria-label="Apply filters"
          >
            View Results
          </button>
        </div>
      </div>
    </>
  );
}
