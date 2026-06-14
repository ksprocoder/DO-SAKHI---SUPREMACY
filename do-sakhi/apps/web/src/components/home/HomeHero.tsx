import Link from "next/link";
import Image from "next/image";

/**
 * HomeHero — Step 4.3 Visual Rescue (Final)
 *
 * Full-viewport editorial hero using real Do Sakhi model photography.
 * Desktop: Full-bleed image with deep emerald overlay on left third for copy.
 * Mobile: Compact but strong hero with bottom-aligned copy.
 * Animations: Ken Burns on image, staggered rise on copy elements.
 * No price. No discount. No countdown.
 */
export default function HomeHero() {
  return (
    <section
      aria-label="Homepage Hero"
      className="relative flex min-h-[92svh] w-full overflow-hidden md:min-h-[92vh]"
      style={{ minHeight: "78svh" }}
    >
      {/* ── Full-bleed hero image ── */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 ds-anim-ken-burns">
          <Image
            src="/images/editorial/hero-cream-coord.jpg"
            alt="Do Sakhi — Ivory cream coord set with lace detail"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* Deep emerald overlay — left side gradient for copy legibility (desktop) */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(2,27,18,0.92) 0%, rgba(2,27,18,0.80) 28%, rgba(2,27,18,0.50) 48%, rgba(2,27,18,0.15) 65%, transparent 80%)",
          }}
        />

        {/* Mobile overlay — full bottom-up gradient */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(2,27,18,0.95) 0%, rgba(2,27,18,0.80) 35%, rgba(2,27,18,0.40) 60%, rgba(2,27,18,0.10) 82%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Top copper accent line ── */}
      <div
        className="absolute top-0 left-0 right-0 z-20 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(167,111,77,0.7) 0%, rgba(167,111,77,0.4) 50%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Vertical copper side accent (desktop) ── */}
      <div
        className="absolute left-[48%] top-0 bottom-0 z-10 hidden md:block"
        style={{
          width: "1px",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(167,111,77,0.25) 20%, rgba(167,111,77,0.35) 50%, rgba(167,111,77,0.25) 80%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Editorial vertical label (desktop right) ── */}
      <div className="absolute bottom-24 right-10 z-20 hidden flex-col items-center gap-4 md:flex">
        <span
          className="ds-label text-white/30"
          style={{ writingMode: "vertical-rl", letterSpacing: "0.22em" }}
        >
          Quiet Luxury
        </span>
        <div
          className="h-16 w-px"
          style={{
            background:
              "linear-gradient(to bottom, rgba(167,111,77,0.55), transparent)",
          }}
        />
      </div>

      {/* ── Copper corner ornament (desktop) ── */}
      <div
        className="absolute top-12 right-12 z-20 hidden h-16 w-16 md:block"
        style={{
          borderTop: "1px solid rgba(167,111,77,0.40)",
          borderRight: "1px solid rgba(167,111,77,0.40)",
        }}
        aria-hidden="true"
      />

      {/* ── Hero content ── */}
      <div className="relative z-30 flex h-full w-full flex-col justify-end px-6 pb-14 md:w-[52%] md:justify-end md:px-[4vw] md:pb-[8vh]">
        
        {/* Desktop Glass Panel behind text */}
        <div className="absolute inset-0 z-0 hidden md:block rounded-tr-[80px] ds-glass-dark opacity-0 ds-anim-rise-delay-1" style={{ width: '120%', left: '-10%', top: '20%', bottom: '-10%' }} />

        <div className="relative z-10 w-full md:pl-10">

        {/* Top accent line — grows in on load */}
        <div className="mb-10 hidden md:block ds-anim-line-grow">
          <div
            className="h-px w-20"
            style={{
              background:
                "linear-gradient(90deg, rgba(167,111,77,0.75) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* Eyebrow */}
        <div className="mb-5 flex items-center gap-4 ds-anim-rise">
          <div
            className="h-px w-8 flex-shrink-0"
            style={{ background: "rgba(167,111,77,0.70)" }}
          />
          <span className="ds-label tracking-widest text-ds-copper">
            The Quiet Luxury Edit
          </span>
        </div>

        {/* Headline */}
        <h1 className="ds-hero-title mb-7 text-white ds-anim-rise-delay-1">
          Grace,
          <br />
          <span className="italic font-light text-ds-soft-sage/90">Tailored</span>
          <br />
          in Silence
        </h1>

        {/* Copper separator */}
        <div
          className="mb-7 h-px w-14 ds-anim-line-grow"
          style={{ background: "rgba(167,111,77,0.45)" }}
          aria-hidden="true"
        />

        {/* Body */}
        <p className="ds-body mb-10 max-w-[400px] leading-loose text-white/72 ds-anim-rise-delay-2">
          Curated suit sets, co-ords and bespoke fits for women who prefer
          elegance without noise.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-5 ds-anim-rise-delay-3">
          <Link
            href="/shop"
            id="hero-cta-explore"
            className="group relative inline-flex items-center justify-center bg-ds-warm-white px-9 text-xs font-medium uppercase tracking-[0.16em] text-ds-deep-forest transition-all duration-500 hover:bg-ds-ivory hover:shadow-[0_15px_30px_rgba(255,253,248,0.2)] focus:outline-none overflow-hidden"
            style={{ height: "52px" }}
          >
            <span className="relative z-10 transition-transform duration-500 group-hover:tracking-[0.20em]">Explore the Collection</span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-ds-warm-white via-ds-ivory to-ds-warm-white opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </Link>
          <Link
            href="#bespoke"
            id="hero-cta-stylist"
            className="hero-stylist-cta ds-glass inline-flex items-center justify-center px-9 text-xs font-medium uppercase tracking-[0.16em] text-white/90 transition-all duration-500 hover:text-white hover:bg-white/10 hover:shadow-[0_15px_30px_rgba(167,111,77,0.15)] focus:outline-none"
            style={{ height: "52px" }}
          >
            Speak to a Stylist
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="mt-14 hidden items-center gap-3 md:flex">
          <div
            className="h-px w-8"
            style={{ background: "rgba(255,255,255,0.18)" }}
          />
          <span className="ds-label text-white/40 tracking-[0.3em] uppercase">Scroll</span>
        </div>
        
        </div>
      </div>
    </section>
  );
}
