import Link from "next/link";
import Image from "next/image";

/**
 * NarrativeCollections — Step 4.3 Visual Rescue
 *
 * Three editorial collection cards backed by real model photography.
 * Asymmetric 60/40 desktop grid, image-led, overlay text.
 */

const collections = [
  {
    id: "01",
    title: "Suit Sets",
    description:
      "Elegant everyday sets crafted for comfort, movement and refined presence.",
    href: "/shop?collection=suit-sets",
    isLarge: true,
    image: "/images/editorial/collection-suits.jpg",
    imageAlt: "Do Sakhi — Dark leaf motif suit set with embroidered neckline",
    tag: "Everyday",
    linkId: "collection-suit-sets",
  },
  {
    id: "02",
    title: "Co-ords",
    description: "Modern pairings with soft structure and understated detail.",
    href: "/shop?collection=co-ord-sets",
    isLarge: false,
    image: "/images/editorial/collection-coords.jpg",
    imageAlt: "Do Sakhi — Teal coord set with ivory appliqué floral motif",
    tag: "Modern",
    linkId: "collection-02",
  },
  {
    id: "03",
    title: "Festive Grace",
    description: "Occasion-ready silhouettes without excess.",
    href: "/shop?collection=festive-grace",
    isLarge: false,
    image: "/images/editorial/collection-festive.jpg",
    imageAlt: "Do Sakhi — Ivory linen 3-piece set with hand embroidery in courtyard",
    tag: "Occasion",
    linkId: "collection-03",
  },
];

export default function NarrativeCollections() {
  return (
    <section
      aria-label="Collections"
      className="bg-ds-warm-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section eyebrow */}
        <div className="mb-12 flex items-center gap-4">
          <div
            className="h-px w-8 flex-shrink-0"
            style={{ background: "rgba(167,111,77,0.5)" }}
          />
          <span className="ds-label text-ds-copper">The Edit</span>
        </div>

        {/* Asymmetric editorial grid — desktop: left 60% large tile, right 40% stacked */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-5">

          {/* Left Large Tile — 3 of 5 cols */}
          <Link
            href={collections[0].href}
            id={collections[0].linkId}
            className="group relative col-span-1 block overflow-hidden rounded-2xl ds-hover-lift ds-shadow-luxury md:col-span-3"
            style={{ minHeight: "620px" }}
          >
            {/* Real image */}
            <Image
              src={collections[0].image}
              alt={collections[0].imageAlt}
              fill
              className="object-cover object-center transition-transform duration-1000 group-hover:scale-[1.05]"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            {/* Overlay gradient — preserves image but adds text legibility */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(2,27,18,0.80) 0%, rgba(2,27,18,0.30) 45%, transparent 75%)",
              }}
            />
            {/* Copper top-right corner */}
            <div
              className="absolute top-8 right-8 h-12 w-12"
              style={{
                borderTop: "1px solid rgba(167,111,77,0.55)",
                borderRight: "1px solid rgba(167,111,77,0.55)",
              }}
            />
            {/* Large collection number — editorial */}
            <div className="absolute top-8 left-8">
              <span
                className="font-serif font-light text-white/20 select-none"
                style={{ fontSize: "clamp(80px, 12vw, 160px)", lineHeight: 1 }}
                aria-hidden="true"
              >
                01
              </span>
            </div>
            {/* Content bottom-left */}
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
              <span className="ds-label mb-3 block text-ds-copper">
                {collections[0].tag}
              </span>
              <h2 className="ds-section-title mb-4 text-white">
                {collections[0].title}
              </h2>
              <p className="ds-body mb-7 max-w-sm text-white/75">
                {collections[0].description}
              </p>
              <span className="ds-label inline-flex items-center gap-3 text-white/85 transition-all duration-300 group-hover:gap-5">
                Discover
                <span
                  className="h-px w-8 transition-all duration-300 group-hover:w-12"
                  style={{ background: "rgba(167,111,77,0.75)" }}
                />
              </span>
            </div>
          </Link>

          {/* Right stacked tiles — 2 of 5 cols */}
          <div className="col-span-1 flex flex-col gap-4 md:col-span-2 md:gap-5">
            {collections.slice(1).map((collection) => (
              <Link
                key={collection.id}
                href={collection.href}
                id={collection.linkId}
                className="group relative block flex-1 overflow-hidden rounded-2xl ds-hover-lift ds-shadow-luxury"
                style={{ minHeight: "297px" }}
              >
                {/* Real image */}
                <Image
                  src={collection.image}
                  alt={collection.imageAlt}
                  fill
                  className="object-cover object-center transition-transform duration-1000 group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(2,27,18,0.78) 0%, rgba(2,27,18,0.20) 50%, transparent 80%)",
                  }}
                />
                {/* Collection number */}
                <div className="absolute top-5 left-5">
                  <span
                    className="font-serif font-light text-white/15 select-none"
                    style={{ fontSize: "clamp(52px, 6vw, 90px)", lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    {collection.id}
                  </span>
                </div>
                {/* Copper corner */}
                <div
                  className="absolute top-5 right-5 h-8 w-8"
                  style={{
                    borderTop: "1px solid rgba(167,111,77,0.5)",
                    borderRight: "1px solid rgba(167,111,77,0.5)",
                  }}
                />
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <span className="ds-label mb-2 block text-ds-copper">
                    {collection.tag}
                  </span>
                  <h3 className="ds-section-title mb-3 text-white">
                    {collection.title}
                  </h3>
                  <p className="ds-body mb-4 max-w-xs text-white/70">
                    {collection.description}
                  </p>
                  <span className="ds-label inline-flex items-center gap-3 text-white/80 transition-all duration-300 group-hover:gap-4">
                    Discover
                    <span
                      className="h-px w-6 transition-all duration-300 group-hover:w-9"
                      style={{ background: "rgba(167,111,77,0.70)" }}
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
