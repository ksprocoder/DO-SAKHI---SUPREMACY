'use client';

/** PDP loading skeleton — luxury editorial style */
export function ProductLoadingSkeleton() {
  const shimmer = {
    background: 'linear-gradient(90deg, #F0EAE0 0%, #E8DED2 40%, #F0EAE0 80%)',
    backgroundSize: '200% 100%',
    animation: 'ds-shimmer 1.8s ease-in-out infinite',
  };

  return (
    <div
      className="mx-auto max-w-7xl px-5 py-12 md:px-10 lg:py-16"
      style={{ animation: 'ds-fade-in 0.4s ease-out both' }}
    >
      <style>{`
        @keyframes ds-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes ds-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Luxury editorial loading label */}
      <div className="mb-10 text-center" aria-live="polite" aria-label="Preparing this piece">
        <p
          className="font-sans uppercase text-xs"
          style={{ color: '#A76F4D', letterSpacing: '0.22em' }}
        >
          Preparing this piece
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

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Gallery Skeleton */}
        <div className="w-full lg:w-3/5 xl:w-[62%]">
          <div
            className="w-full"
            style={{ ...shimmer, aspectRatio: '4/5', marginBottom: '12px', borderRadius: '1px' }}
          />
          {/* Thumbnail strip */}
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{ ...shimmer, width: '72px', height: '88px', borderRadius: '1px' }}
              />
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div
          className="w-full lg:w-2/5 xl:w-[38%] flex flex-col gap-4"
          style={{ animationDelay: '120ms', animation: 'ds-fade-in 0.5s ease-out both' }}
        >
          {/* Category */}
          <div style={{ ...shimmer, height: '11px', width: '22%' }} />
          {/* Title */}
          <div style={{ ...shimmer, height: '30px', width: '82%' }} />
          <div style={{ ...shimmer, height: '20px', width: '58%' }} />
          {/* Price */}
          <div style={{ ...shimmer, height: '22px', width: '28%', marginTop: '8px' }} />
          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(167,111,77,0.15)', margin: '8px 0' }} />
          {/* Size selector */}
          <div style={{ ...shimmer, height: '58px', width: '100%' }} />
          {/* CTA buttons */}
          <div style={{ ...shimmer, height: '50px', width: '100%', marginTop: '8px' }} />
          <div style={{ ...shimmer, height: '50px', width: '100%' }} />
          {/* Accordion */}
          <div style={{ ...shimmer, height: '180px', width: '100%', marginTop: '16px' }} />
        </div>
      </div>
    </div>
  );
}

/** PDP product not found — premium editorial */
export function ProductNotFoundState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-32 text-center px-5"
      role="alert"
      aria-live="polite"
    >
      {/* Ornamental vertical line */}
      <div
        style={{
          width: '1px',
          height: '56px',
          background: 'linear-gradient(180deg, transparent, rgba(167,111,77,0.5), transparent)',
          margin: '0 auto 32px',
        }}
        aria-hidden="true"
      />

      <p
        className="font-sans uppercase text-xs tracking-[0.2em] mb-6"
        style={{ color: '#A76F4D' }}
      >
        Piece Not Found
      </p>

      <h1
        className="font-serif mb-4"
        style={{ color: '#073F34', fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 300, lineHeight: 1.15 }}
      >
        This piece is no longer in the edit.
      </h1>
      <p
        className="ds-body mb-10"
        style={{ color: '#6E675F', maxWidth: '380px', lineHeight: 1.7 }}
      >
        It may have sold out or been retired from the collection.
        Explore the current Do Sakhi edit to find something equally graceful.
      </p>

      {/* Copper rule */}
      <div
        style={{
          width: '40px',
          height: '1px',
          background: 'rgba(167,111,77,0.4)',
          margin: '0 auto 32px',
        }}
        aria-hidden="true"
      />

      <a
        href="/shop"
        className="font-sans text-xs font-medium uppercase tracking-widest transition-all hover:shadow-lg"
        style={{
          backgroundColor: '#073F34',
          color: '#F8F3EA',
          padding: '14px 36px',
          letterSpacing: '0.18em',
          display: 'inline-block',
        }}
        id="product-not-found-back-btn"
      >
        Return to the Collection
      </a>
    </div>
  );
}

/** PDP API error state */
export function ProductErrorState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-32 text-center px-5"
      role="alert"
      aria-live="polite"
    >
      <div
        className="mb-6"
        style={{
          width: '56px',
          height: '56px',
          border: '1px solid rgba(167,111,77,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 7v6M12 17h.01" stroke="#A76F4D" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="10" stroke="#A76F4D" strokeWidth="1.2" />
        </svg>
      </div>
      <h1
        className="font-serif mb-4"
        style={{ color: '#073F34', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 300 }}
      >
        We could not load this piece right now.
      </h1>
      <p
        className="ds-body mb-8"
        style={{ color: '#6E675F', maxWidth: '400px' }}
      >
        Please return to the collection and try again in a moment.
      </p>
      <a
        href="/shop"
        className="font-sans text-xs font-medium uppercase tracking-widest transition-all"
        style={{
          border: '1.5px solid #073F34',
          color: '#073F34',
          padding: '13px 32px',
          letterSpacing: '0.16em',
          display: 'inline-block',
        }}
        id="product-error-back-btn"
      >
        Return to Shop
      </a>
    </div>
  );
}
