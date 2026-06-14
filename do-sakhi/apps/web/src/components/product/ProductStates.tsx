'use client';

export function ProductLoadingSkeleton() {
  const shimmer = {
    background: 'linear-gradient(90deg, #F0EAE0 0%, #E8DED2 40%, #F0EAE0 80%)',
    backgroundSize: '200% 100%',
    animation: 'ds-shimmer 1.4s ease-in-out infinite',
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-10 lg:py-16">
      <style>{`
        @keyframes ds-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Gallery Skeleton */}
        <div className="w-full lg:w-3/5 xl:w-[62%]">
          <div
            className="w-full"
            style={{ ...shimmer, aspectRatio: '4/5', marginBottom: '16px' }}
          />
        </div>
        
        {/* Info Skeleton */}
        <div className="w-full lg:w-2/5 xl:w-[38%] flex flex-col gap-6">
          <div style={{ ...shimmer, height: '14px', width: '20%', marginBottom: '4px' }} />
          <div style={{ ...shimmer, height: '32px', width: '80%', marginBottom: '4px' }} />
          <div style={{ ...shimmer, height: '16px', width: '40%', marginBottom: '16px' }} />
          <div style={{ ...shimmer, height: '24px', width: '30%', marginBottom: '24px' }} />
          
          <div style={{ ...shimmer, height: '60px', width: '100%', marginBottom: '24px' }} />
          
          <div style={{ ...shimmer, height: '48px', width: '100%', marginBottom: '16px' }} />
          <div style={{ ...shimmer, height: '48px', width: '100%', marginBottom: '32px' }} />
          
          <div style={{ ...shimmer, height: '200px', width: '100%', marginBottom: '16px' }} />
        </div>
      </div>
    </div>
  );
}

export function ProductNotFoundState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-32 text-center px-5"
      role="alert"
      aria-live="polite"
    >
      <div
        className="mb-6 ds-product-fallback"
        style={{ width: '80px', height: '96px', position: 'relative' }}
        aria-hidden="true"
      />
      <h1
        className="font-serif mb-4"
        style={{ color: '#073F34', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300 }}
      >
        This piece is no longer available.
      </h1>
      <p
        className="ds-body mb-8"
        style={{ color: '#6E675F', maxWidth: '420px' }}
      >
        Explore the current Do Sakhi edit to find something equally graceful.
      </p>
      <a
        href="/shop"
        className="font-sans text-xs font-medium uppercase tracking-widest transition-all"
        style={{
          backgroundColor: '#073F34',
          color: '#F8F3EA',
          padding: '14px 32px',
          letterSpacing: '0.16em',
          display: 'inline-block'
        }}
      >
        Back to Shop
      </a>
    </div>
  );
}

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
        style={{ color: '#073F34', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300 }}
      >
        We could not load this piece right now.
      </h1>
      <p
        className="ds-body mb-8"
        style={{ color: '#6E675F', maxWidth: '420px' }}
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
          display: 'inline-block'
        }}
      >
        Return to Shop
      </a>
    </div>
  );
}
