/**
 * BoutiquePromise — Step 4.2 Luxury Visual Revamp
 *
 * 4 refined promise columns. Elegant typographic hierarchy.
 * Minimal markers, clean separators, copper accents.
 * Feels like a boutique brand promise, not a marketplace trust badge section.
 */

const promises = [
  {
    id: "promise-1",
    numeral: "I",
    title: "Curated Limited Pieces",
    description: "Small-batch edits selected with a boutique eye.",
  },
  {
    id: "promise-2",
    numeral: "II",
    title: "Custom Fit Guidance",
    description:
      "Measurement guidance designed to improve confidence before ordering.",
  },
  {
    id: "promise-3",
    numeral: "III",
    title: "Artisanal Heritage",
    description:
      "Indian silhouettes, textile details and restrained modern styling.",
  },
  {
    id: "promise-4",
    numeral: "IV",
    title: "Considered Delivery",
    description:
      "Careful packing and clear communication from order to dispatch.",
  },
];

export default function BoutiquePromise() {
  return (
    <section
      aria-label="Boutique Promise"
      className="py-20 md:py-28"
      style={{
        background: "linear-gradient(180deg, #FFFDF8 0%, #FAF5EE 100%)",
        borderTop: "1px solid #E8DED2",
      }}
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Section header */}
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <div
                className="h-px w-8 flex-shrink-0"
                style={{ background: "rgba(167,111,77,0.5)" }}
              />
              <span className="ds-label text-ds-copper">Our Promise</span>
            </div>
            <h2 className="ds-section-title text-ds-deep-forest">
              The Boutique Standard
            </h2>
          </div>
          {/* Decorative mark */}
          <span
            className="hidden font-serif font-light text-ds-muted-sage/40 md:block select-none"
            style={{ fontSize: "48px", lineHeight: 1 }}
            aria-hidden="true"
          >
            ✦
          </span>
        </div>

        {/* Top copper line */}
        <div
          className="mb-14 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(167,111,77,0.4) 0%, rgba(167,111,77,0.1) 100%)",
          }}
          aria-hidden="true"
        />

        {/* 4-column promise grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {promises.map((promise, index) => (
            <div key={promise.id} className="flex flex-col">
              {/* Roman numeral marker */}
              <div className="mb-5 flex items-baseline gap-3">
                <span
                  className="font-serif font-light text-ds-copper/50 select-none"
                  style={{ fontSize: "clamp(20px, 2.5vw, 28px)", lineHeight: 1 }}
                  aria-hidden="true"
                >
                  {promise.numeral}
                </span>
                {/* Short copper tick */}
                <div
                  className="h-px flex-1 max-w-[32px]"
                  style={{ background: "rgba(167,111,77,0.35)" }}
                />
              </div>

              {/* Title */}
              <h3
                className="mb-3 font-sans font-semibold text-ds-charcoal"
                style={{ fontSize: "14px", letterSpacing: "0.01em", lineHeight: 1.4 }}
              >
                {promise.title}
              </h3>

              {/* Description */}
              <p
                className="font-sans text-ds-muted-text"
                style={{
                  fontSize: "13px",
                  lineHeight: "1.75",
                  letterSpacing: "0.01em",
                }}
              >
                {promise.description}
              </p>

              {/* Bottom separator on all but last */}
              {index < promises.length - 1 && (
                <div
                  className="mt-8 block h-px lg:hidden"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(232,222,210,0.8) 0%, transparent 100%)",
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>

        {/* Bottom editorial strip */}
        <div
          className="mt-16 flex flex-col gap-5 border-t pt-8 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "#E8DED2" }}
        >
          <p
            className="font-sans text-ds-muted-text/70"
            style={{ fontSize: "12px", letterSpacing: "0.04em" }}
          >
            Every Do Sakhi piece is prepared with quiet intention.
          </p>
          <div className="flex items-center gap-3">
            <div
              className="h-px w-12"
              style={{ background: "rgba(167,111,77,0.35)" }}
            />
            <span
              className="font-serif font-light text-ds-copper/40 select-none"
              style={{ fontSize: "20px" }}
              aria-hidden="true"
            >
              ✦
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
