'use client';

/** Shop page loading skeleton */
export function ShopLoadingSkeleton() {
  const shimmer = {
    background: 'linear-gradient(90deg, #F0EAE0 0%, #E8DED2 40%, #F0EAE0 80%)',
    backgroundSize: '200% 100%',
    animation: 'ds-shimmer 1.4s ease-in-out infinite',
  };

  return (
    <div>
      <style>{`
        @keyframes ds-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} aria-hidden="true">
            {/* Image skeleton */}
            <div
              className="w-full"
              style={{ ...shimmer, aspectRatio: '4/5', marginBottom: '16px' }}
            />
            {/* Badge skeleton */}
            <div
              style={{ ...shimmer, height: '12px', width: '70px', marginBottom: '10px' }}
            />
            {/* Title skeleton */}
            <div
              style={{ ...shimmer, height: '14px', width: '85%', marginBottom: '8px' }}
            />
            <div
              style={{ ...shimmer, height: '12px', width: '55%', marginBottom: '12px' }}
            />
            {/* Price skeleton */}
            <div
              style={{ ...shimmer, height: '15px', width: '60px', marginBottom: '4px' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Shop page error state */
export function ShopErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 text-center"
      role="alert"
      aria-live="polite"
    >
      <div
        className="mb-6"
        style={{
          width: '48px',
          height: '48px',
          border: '1px solid rgba(167,111,77,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 6v5M10 14h.01" stroke="#A76F4D" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="#A76F4D" strokeWidth="1.2" />
        </svg>
      </div>

      <p
        className="font-serif mb-3"
        style={{ color: '#073F34', fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 300 }}
      >
        We could not load the collection right now.
      </p>
      <p
        className="ds-body mb-8"
        style={{ color: '#6E675F', maxWidth: '360px' }}
      >
        Please refresh, or explore again in a moment.
      </p>
      <button
        onClick={onRetry}
        className="font-sans text-xs font-medium uppercase tracking-widest transition-all hover:shadow-md"
        style={{
          backgroundColor: '#073F34',
          color: '#F8F3EA',
          padding: '13px 32px',
          letterSpacing: '0.16em',
        }}
        aria-label="Try loading products again"
        id="shop-retry-btn"
      >
        Try Again
      </button>
    </div>
  );
}

/** Shop page empty state */
export function ShopEmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 text-center"
      role="status"
      aria-live="polite"
    >
      <div
        className="mb-6 ds-product-fallback"
        style={{ width: '80px', height: '96px', position: 'relative' }}
        aria-hidden="true"
      />

      <p
        className="font-serif mb-3"
        style={{ color: '#073F34', fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 300 }}
      >
        No pieces found for this selection.
      </p>
      <p
        className="ds-body mb-8"
        style={{ color: '#6E675F', maxWidth: '320px' }}
      >
        Try clearing a filter or exploring another edit.
      </p>
      <button
        onClick={onClearFilters}
        className="font-sans text-xs font-medium uppercase tracking-widest transition-all"
        style={{
          border: '1.5px solid #073F34',
          color: '#073F34',
          padding: '12px 28px',
          letterSpacing: '0.16em',
        }}
        aria-label="Clear all active filters"
        id="shop-clear-filters-btn"
      >
        Clear Filters
      </button>
    </div>
  );
}
