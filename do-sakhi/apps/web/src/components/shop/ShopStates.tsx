'use client';

/** Shop page loading skeleton — luxury editorial style */
export function ShopLoadingSkeleton() {
  const shimmer = {
    background: 'linear-gradient(90deg, #F0EAE0 0%, #E8DED2 40%, #F0EAE0 80%)',
    backgroundSize: '200% 100%',
    animation: 'ds-shimmer 1.8s ease-in-out infinite',
  };

  return (
    <div style={{ animation: 'ds-fade-in 0.4s ease-out both' }}>
      <style>{`
        @keyframes ds-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes ds-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Luxury editorial loading label */}
      <div className="mb-10 text-center" aria-live="polite" aria-label="Curating the edit">
        <p
          className="font-sans uppercase tracking-[0.22em] text-xs"
          style={{ color: '#A76F4D', letterSpacing: '0.22em' }}
        >
          Curating the edit
        </p>
        <div
          style={{
            margin: '12px auto 0',
            width: '32px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #A76F4D, transparent)',
          }}
        />
      </div>

      {/* Skeleton grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{ animationDelay: `${i * 80}ms`, animation: 'ds-fade-in 0.5s ease-out both' }}
          >
            {/* Image skeleton */}
            <div
              className="w-full"
              style={{ ...shimmer, aspectRatio: '4/5', marginBottom: '16px', borderRadius: '1px' }}
            />
            {/* Badge skeleton */}
            <div
              style={{ ...shimmer, height: '10px', width: '60px', marginBottom: '10px' }}
            />
            {/* Title skeleton */}
            <div
              style={{ ...shimmer, height: '13px', width: '85%', marginBottom: '8px' }}
            />
            <div
              style={{ ...shimmer, height: '11px', width: '55%', marginBottom: '12px' }}
            />
            {/* Price skeleton */}
            <div
              style={{ ...shimmer, height: '14px', width: '55px', marginBottom: '4px' }}
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
        style={{ color: '#073F34', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 300 }}
      >
        The collection could not be arranged right now.
      </p>
      <p
        className="ds-body mb-8"
        style={{ color: '#6E675F', maxWidth: '340px' }}
      >
        Please refresh, or return to the edit in a moment.
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
      {/* Ornamental icon */}
      <div
        className="mb-8"
        style={{
          width: '1px',
          height: '48px',
          background: 'linear-gradient(180deg, transparent, rgba(167,111,77,0.4), transparent)',
          margin: '0 auto 28px',
        }}
        aria-hidden="true"
      />

      <p
        className="font-serif mb-3"
        style={{ color: '#073F34', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 300 }}
      >
        No pieces found for this selection.
      </p>
      <p
        className="ds-body mb-8"
        style={{ color: '#6E675F', maxWidth: '320px' }}
      >
        Refine the filters or return to the full collection.
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
