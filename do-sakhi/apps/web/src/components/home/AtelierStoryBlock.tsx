import Image from "next/image";

/**
 * AtelierStoryBlock — Step 4.3 Visual Rescue
 *
 * Two-column magazine spread layout.
 * Left: Real model photo (dark black suit — craft/atelier mood).
 * Right: Editorial copy with strong typographic hierarchy.
 */
export default function AtelierStoryBlock() {
  return (
    <section
      aria-label="Atelier Story"
      style={{
        background:
          "linear-gradient(180deg, #E8EDE7 0%, #DDE7DC 50%, #D5E3D4 100%)",
      }}
      className="py-20 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Two-column desktop layout */}
        <div className="flex flex-col gap-16 md:flex-row md:items-stretch md:gap-20 lg:gap-28">

          {/* ── Left: Real model photograph ── */}
          <div className="relative w-full md:w-1/2">
            {/* Main image frame */}
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4/5" }}
            >
              <Image
                src="/images/editorial/atelier-craft.jpg"
                alt="Do Sakhi — Dark charcoal suit with ivory leaf block print detail"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Subtle sage overlay on image edges */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(221,231,220,0.15) 0%, transparent 30%, transparent 70%, rgba(213,227,212,0.25) 100%)",
                }}
              />
              {/* Top-right ornamental corner */}
              <div
                className="absolute top-8 right-8 h-14 w-14 z-10"
                style={{
                  borderTop: "1px solid rgba(248,243,234,0.45)",
                  borderRight: "1px solid rgba(248,243,234,0.45)",
                }}
              />
              {/* Bottom-left ornamental corner */}
              <div
                className="absolute bottom-8 left-8 h-14 w-14 z-10"
                style={{
                  borderBottom: "1px solid rgba(248,243,234,0.45)",
                  borderLeft: "1px solid rgba(248,243,234,0.45)",
                }}
              />
              {/* Fabric detail labels — editorial stickers */}
              <div className="absolute top-10 left-8 z-10 flex flex-col gap-4">
                {["FABRIC", "FALL", "DETAIL"].map((label) => (
                  <div key={label} className="flex items-center gap-2">
                    <div
                      className="h-px w-5"
                      style={{ background: "rgba(248,243,234,0.55)" }}
                    />
                    <span
                      className="ds-label text-white/60"
                      style={{ letterSpacing: "0.2em" }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Caption bar below panel */}
            <div className="mt-4 flex items-center gap-4 px-1">
              <div
                className="h-px flex-1"
                style={{ background: "rgba(167,111,77,0.35)" }}
              />
              <span
                className="ds-label text-ds-muted-text/70"
                style={{ textTransform: "none", letterSpacing: "0.08em" }}
              >
                Fabrics & Craft, 2025 Edit
              </span>
            </div>
          </div>

          {/* ── Right: Editorial copy ── */}
          <div className="flex w-full flex-col justify-center md:w-1/2">
            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-4">
              <div
                className="h-px w-8 flex-shrink-0"
                style={{ background: "rgba(167,111,77,0.55)" }}
              />
              <span className="ds-label text-ds-copper">
                The Atelier Note
              </span>
            </div>

            {/* Headline */}
            <h2 className="ds-section-title mb-6 text-ds-deep-forest">
              Every detail
              <br />
              begins with touch.
            </h2>

            {/* Copper separator */}
            <div
              className="mb-8 h-px w-20"
              style={{
                background:
                  "linear-gradient(90deg, rgba(167,111,77,0.55) 0%, transparent 100%)",
              }}
            />

            {/* Body */}
            <p className="ds-body mb-6 max-w-md text-ds-charcoal/80">
              From breathable everyday fabrics to refined festive textures,
              every Do Sakhi piece is selected for softness, fall, comfort and
              quiet detail.
            </p>
            <p className="ds-body mb-10 max-w-md text-ds-charcoal/70">
              The brand celebrates Indian silhouettes through a restrained,
              modern lens — never loud, always considered.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <span
                className="ds-label cursor-pointer text-ds-charcoal transition-all duration-300 hover:text-ds-copper"
                style={{
                  borderBottom: "1px solid rgba(167,111,77,0.45)",
                  paddingBottom: "2px",
                }}
              >
                Read the Craft Note
              </span>
              <span
                className="h-px w-6"
                style={{ background: "rgba(167,111,77,0.45)" }}
              />
            </div>

            {/* Bottom editorial accent */}
            <div className="mt-16 hidden md:block">
              <div
                className="h-px w-full max-w-xs"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(167,111,77,0.25) 0%, transparent 100%)",
                }}
              />
              <div className="mt-5 flex items-center gap-3">
                <span
                  className="font-serif text-2xl font-light text-ds-muted-sage/50"
                  aria-hidden="true"
                >
                  ✦
                </span>
                <span className="ds-label text-ds-muted-text/55">
                  Quiet. Considered. Indian.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
