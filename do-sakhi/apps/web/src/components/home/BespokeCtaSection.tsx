import Link from "next/link";
import Image from "next/image";

/**
 * BespokeCtaSection — Step 4.3 Visual Rescue
 *
 * Premium conversion block in deep emerald.
 * Left: editorial copy with service indicators.
 * Right: real model photo (bespoke-panel — yellow coord, warm editorial).
 */

const serviceIndicators = [
  { mark: "—", label: "Size guidance" },
  { mark: "—", label: "Length & fall notes" },
  { mark: "—", label: "Pre-dispatch boutique review" },
];

export default function BespokeCtaSection() {
  return (
    <section
      id="bespoke"
      aria-label="Bespoke Fit Guidance"
      className="relative overflow-hidden py-24 md:py-36"
      style={{
        background:
          "linear-gradient(165deg, #022B24 0%, #033830 40%, #073F34 70%, #0A4A3C 100%)",
      }}
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 36px,
              rgba(167,111,77,0.05) 36px,
              rgba(167,111,77,0.05) 37px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 36px,
              rgba(167,111,77,0.03) 36px,
              rgba(167,111,77,0.03) 37px
            )
          `,
          opacity: 0.6,
        }}
        aria-hidden="true"
      />

      {/* Radial warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(167,111,77,0.07) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      {/* Top copper line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(167,111,77,0.45) 30%, rgba(167,111,77,0.6) 50%, rgba(167,111,77,0.45) 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-16 md:flex-row md:items-center md:gap-20">

          {/* ── Left: Copy block ── */}
          <div className="w-full md:w-[55%]">
            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-4">
              <div
                className="h-px w-8 flex-shrink-0"
                style={{ background: "rgba(167,111,77,0.6)" }}
              />
              <span className="ds-label text-ds-copper">
                Bespoke Fit Guidance
              </span>
            </div>

            {/* Headline */}
            <h2 className="ds-section-title mb-8 text-ds-warm-white">
              A fit that
              <br />
              <span className="italic text-ds-soft-sage/80">
                feels personal.
              </span>
            </h2>

            {/* Copper divider */}
            <div
              className="mb-8 h-px w-20"
              style={{
                background:
                  "linear-gradient(90deg, rgba(167,111,77,0.6) 0%, transparent 100%)",
              }}
              aria-hidden="true"
            />

            {/* Body */}
            <p className="ds-body mb-12 max-w-lg leading-loose text-white/70">
              Unsure about size, length or fall? Share your measurements during
              the product journey and our boutique team will guide you before
              your piece is prepared. Every garment, considered carefully.
            </p>

            {/* Service indicators */}
            <div className="mb-12 flex flex-col gap-3">
              {serviceIndicators.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <span
                    className="font-serif text-ds-copper/70"
                    style={{ fontSize: "20px", lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    {item.mark}
                  </span>
                  <span
                    className="ds-label text-white/55"
                    style={{ textTransform: "none", letterSpacing: "0.04em" }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
              <Link
                href="/shop?customTailoring=true"
                id="bespoke-cta-explore"
                className="inline-flex items-center justify-center bg-ds-warm-white font-sans text-xs font-medium uppercase tracking-[0.16em] text-ds-deep-forest transition-all duration-300 hover:bg-ds-ivory focus:outline-none focus:ring-2 focus:ring-ds-copper focus:ring-offset-2 focus:ring-offset-ds-deep-forest"
                style={{ height: "52px", padding: "0 36px" }}
              >
                Explore Custom Fit Pieces
              </Link>
              <a
                href="#"
                id="bespoke-cta-stylist"
                className="inline-flex items-center justify-center border font-sans text-xs font-medium uppercase tracking-[0.16em] text-white/90 transition-all duration-300 hover:border-ds-copper/70 focus:outline-none focus:ring-2 focus:ring-ds-copper focus:ring-offset-2 focus:ring-offset-ds-deep-forest"
                style={{
                  height: "52px",
                  padding: "0 36px",
                  borderColor: "rgba(167,111,77,0.4)",
                }}
              >
                Ask a Stylist
              </a>
            </div>
          </div>

          {/* ── Right: Real model photograph ── */}
          <div className="hidden w-full md:block md:w-[45%]">
            <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <Image
                src="/images/editorial/bespoke-panel.jpg"
                alt="Do Sakhi — Mustard yellow lace coord set with crochet hemline detail"
                fill
                className="object-cover object-center"
                sizes="45vw"
              />
              {/* Dark emerald edge blend to merge with section bg */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to left, transparent 60%, rgba(3,56,48,0.5) 100%)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 70%, rgba(2,43,36,0.6) 100%)",
                }}
              />
              {/* Corner ornaments */}
              <div
                className="absolute top-8 left-8 h-14 w-14"
                style={{
                  borderTop: "1px solid rgba(248,243,234,0.25)",
                  borderLeft: "1px solid rgba(248,243,234,0.25)",
                }}
              />
              <div
                className="absolute top-8 right-8 h-14 w-14"
                style={{
                  borderTop: "1px solid rgba(248,243,234,0.25)",
                  borderRight: "1px solid rgba(248,243,234,0.25)",
                }}
              />
              <div
                className="absolute bottom-8 right-8 h-14 w-14"
                style={{
                  borderBottom: "1px solid rgba(248,243,234,0.25)",
                  borderRight: "1px solid rgba(248,243,234,0.25)",
                }}
              />
              {/* Vertical "Custom Fit" label */}
              <div className="absolute bottom-12 left-10 flex flex-col items-center gap-3">
                <div
                  className="w-px"
                  style={{
                    height: "60px",
                    background:
                      "linear-gradient(to bottom, transparent, rgba(167,111,77,0.5))",
                  }}
                />
                <span
                  className="ds-label text-white/25"
                  style={{
                    writingMode: "vertical-rl",
                    letterSpacing: "0.2em",
                    fontSize: "9px",
                  }}
                >
                  Custom Fit
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom copper line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(167,111,77,0.3) 30%, rgba(167,111,77,0.45) 50%, rgba(167,111,77,0.3) 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
