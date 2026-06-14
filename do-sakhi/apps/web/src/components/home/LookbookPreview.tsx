import Link from "next/link";
import Image from "next/image";

/**
 * LookbookPreview — Step 4.3 Visual Rescue
 *
 * Three editorial lookbook frames using real model photography.
 * Asymmetric magazine layout. Image-led with overlay labels.
 */

const lookbookItems = [
  {
    id: "lookbook-morning",
    label: "Morning",
    title: "Soft Morning Drape",
    description: "First light, cream fabric, unhurried grace.",
    isLarge: true,
    image: "/images/editorial/lookbook-morning.jpg",
    imageAlt: "Do Sakhi — Cream ivory lace coord set, clean studio morning editorial",
    overlayStyle: {
      background:
        "linear-gradient(to top, rgba(2,43,36,0.72) 0%, rgba(2,43,36,0.15) 50%, transparent 80%)",
    },
    accentColor: "rgba(167,111,77,0.70)",
  },
  {
    id: "lookbook-office",
    label: "Everyday",
    title: "Office Grace",
    description: "Measured elegance for days that ask more of you.",
    isLarge: false,
    image: "/images/editorial/lookbook-office.jpg",
    imageAlt: "Do Sakhi — Sunshine yellow embroidered suit for everyday office wear",
    overlayStyle: {
      background:
        "linear-gradient(to top, rgba(2,20,12,0.80) 0%, rgba(2,20,12,0.25) 55%, transparent 80%)",
    },
    accentColor: "rgba(167,111,77,0.72)",
  },
  {
    id: "lookbook-evening",
    label: "Evening",
    title: "Evening Stillness",
    description: "The hour when less says more.",
    isLarge: false,
    image: "/images/editorial/lookbook-evening.jpg",
    imageAlt: "Do Sakhi — Black embroidered suit with Ajrak dupatta for evening",
    overlayStyle: {
      background:
        "linear-gradient(to top, rgba(28,10,5,0.82) 0%, rgba(28,10,5,0.25) 55%, transparent 80%)",
    },
    accentColor: "rgba(185,137,118,0.75)",
  },
];

export default function LookbookPreview() {
  return (
    <section
      aria-label="Lookbook Preview"
      className="bg-ds-ivory py-20 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Section header */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <div className="mb-5 flex items-center gap-4">
              <div
                className="h-px w-8 flex-shrink-0"
                style={{ background: "rgba(167,111,77,0.5)" }}
              />
              <span className="ds-label text-ds-copper">Lookbook</span>
            </div>
            <h2 className="ds-section-title mb-6 text-ds-deep-forest">
              The Everyday
              <br />
              <span className="italic">Grace Story</span>
            </h2>
            <p className="ds-body max-w-md text-ds-charcoal/70">
              A quiet study of movement, fabric and form — styled for women who
              prefer elegance without effort.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="#lookbook"
              id="lookbook-cta"
              className="inline-flex items-center gap-4 border border-ds-border bg-transparent px-8 font-sans text-xs font-medium uppercase tracking-[0.16em] text-ds-deep-forest transition-all duration-300 hover:border-ds-charcoal hover:bg-ds-charcoal hover:text-ds-warm-white focus:outline-none focus:ring-2 focus:ring-ds-copper"
              style={{ height: "52px" }}
            >
              View Lookbook
            </Link>
          </div>
        </div>

        {/* Editorial card grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 md:gap-5">

          {/* Large left card — spans 2 columns and 2 rows on desktop */}
          <div
            className="group relative overflow-hidden rounded-2xl ds-hover-lift ds-shadow-luxury md:col-span-2 md:row-span-2"
            style={{ minHeight: "520px" }}
          >
            <Image
              src={lookbookItems[0].image}
              alt={lookbookItems[0].imageAlt}
              fill
              className="object-cover object-top transition-transform duration-1000 group-hover:scale-[1.05]"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
            <div className="absolute inset-0" style={lookbookItems[0].overlayStyle} />

            {/* Copper corner */}
            <div
              className="absolute top-8 right-8 h-12 w-12"
              style={{
                borderTop: "1px solid rgba(167,111,77,0.45)",
                borderRight: "1px solid rgba(167,111,77,0.45)",
              }}
            />
            {/* Number */}
            <div className="absolute top-8 left-8">
              <span
                className="font-serif font-light text-white/12 select-none"
                style={{ fontSize: "100px", lineHeight: 1 }}
                aria-hidden="true"
              >
                01
              </span>
            </div>

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
              <span className="ds-label mb-3 block text-ds-copper">
                {lookbookItems[0].label}
              </span>
              <h3
                className="mb-3 font-serif font-light text-white"
                style={{ fontSize: "clamp(24px, 3.5vw, 42px)", lineHeight: 1.1 }}
              >
                {lookbookItems[0].title}
              </h3>
              <p className="ds-body mb-6 max-w-sm text-white/70">
                {lookbookItems[0].description}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="h-px w-8 transition-all duration-400 group-hover:w-14"
                  style={{ background: lookbookItems[0].accentColor }}
                />
                <span className="ds-label text-white/75">View Story</span>
              </div>
            </div>
          </div>

          {/* Right small cards */}
          {lookbookItems.slice(1).map((item, i) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl ds-hover-lift ds-shadow-luxury"
              style={{ minHeight: "250px" }}
            >
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                className="object-cover object-center transition-transform duration-1000 group-hover:scale-[1.05]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0" style={item.overlayStyle} />

              {/* Corner ornament */}
              <div
                className="absolute top-5 right-5 h-8 w-8"
                style={{
                  borderTop: "1px solid rgba(167,111,77,0.45)",
                  borderRight: "1px solid rgba(167,111,77,0.45)",
                }}
              />
              {/* Number */}
              <div className="absolute top-4 left-5">
                <span
                  className="font-serif font-light text-white/10 select-none"
                  style={{ fontSize: "60px", lineHeight: 1 }}
                  aria-hidden="true"
                >
                  0{i + 2}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="ds-label mb-2 block text-ds-copper">
                  {item.label}
                </span>
                <h3
                  className="mb-2 font-serif font-light text-white"
                  style={{ fontSize: "clamp(18px, 2.5vw, 26px)", lineHeight: 1.15 }}
                >
                  {item.title}
                </h3>
                <p className="ds-body text-sm text-white/60">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
