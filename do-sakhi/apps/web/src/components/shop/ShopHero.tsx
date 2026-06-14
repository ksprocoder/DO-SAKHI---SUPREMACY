/**
 * ShopHero — Editorial header for the /shop page.
 * Compact but premium. Ivory + emerald palette.
 * Includes product count slot, editorial copy, copper divider.
 */

interface ShopHeroProps {
  totalProducts: number;
  loading: boolean;
}

export default function ShopHero({ totalProducts, loading }: ShopHeroProps) {
  return (
    <section
      aria-label="Shop Editorial Header"
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #F8F3EA 0%, #EDE8DF 45%, #DDE7DC 100%)',
        borderBottom: '1px solid #E8DED2',
      }}
    >
      {/* Copper corner ornament — desktop */}
      <div
        className="absolute top-8 right-12 hidden md:block"
        style={{
          width: '48px',
          height: '48px',
          borderTop: '1px solid rgba(167,111,77,0.35)',
          borderRight: '1px solid rgba(167,111,77,0.35)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-8 left-12 hidden md:block"
        style={{
          width: '36px',
          height: '36px',
          borderBottom: '1px solid rgba(167,111,77,0.25)',
          borderLeft: '1px solid rgba(167,111,77,0.25)',
        }}
        aria-hidden="true"
      />

      {/* Background texture radials */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 10% 50%, rgba(167,111,77,0.06) 0%, transparent 55%), radial-gradient(ellipse at 90% 20%, rgba(7,63,52,0.07) 0%, transparent 50%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-14 md:py-20 md:px-10">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="mb-5 flex items-center gap-3">
            <div
              className="h-px w-8 flex-shrink-0"
              style={{ background: 'rgba(167,111,77,0.60)' }}
              aria-hidden="true"
            />
            <span
              className="ds-label"
              style={{ color: '#A76F4D', letterSpacing: '0.20em', fontSize: '10px' }}
            >
              Small-batch boutique inventory
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="ds-section-title mb-5"
            style={{ color: '#073F34', fontSize: 'clamp(32px, 4vw, 58px)' }}
          >
            Shop the Edit
          </h1>

          {/* Copper divider */}
          <div
            className="mb-5 ds-copper-line-left ds-anim-line-grow"
            style={{ width: '80px' }}
            aria-hidden="true"
          />

          {/* Subtitle */}
          <p
            className="ds-body mb-7"
            style={{ color: '#6E675F', maxWidth: '520px', lineHeight: 1.8 }}
          >
            Curated pieces, quietly chosen — suit sets, co-ords, kurtis and
            occasion-ready looks selected for graceful silhouettes, soft textures
            and everyday elegance.
          </p>

          {/* Product count */}
          <p
            className="ds-label"
            style={{ color: '#B8C9BC', letterSpacing: '0.16em', fontSize: '10px' }}
          >
            {loading ? 'Loading collection…' : `${totalProducts} piece${totalProducts !== 1 ? 's' : ''} curated`}
          </p>
        </div>
      </div>
    </section>
  );
}
