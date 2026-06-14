import { apiClient } from "@/lib/api-client";
import { ProductSummary } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { ProductImage } from "../shop/ProductImage";
import { formatPrice, formatEnum } from "../shop/shop-utils";/**
 * NewlyCuratedPreview — Step 4.3 Visual Rescue
 *
 * Fetches live products from the API. Falls back to a 4-card editorial
 * grid using real model photography when the API is offline or empty.
 * Product cards show a luxury 4:5 image frame with boutique metadata.
 */

/** Editorial fallback cards shown when API is unreachable */
const editorialFallbackCards = [
  {
    id: "f1",
    image: "/images/editorial/product-1.jpg",
    alt: "Do Sakhi — Lime green embroidered floral suit with dupatta",
    category: "Suit Sets",
    title: "Lime Blossom Suit Set",
    fabric: "Cotton · Appliqué Floral",
    sizes: ["S", "M", "L", "XL", "XXL"],
    price: "₹2,490",
  },
  {
    id: "f2",
    image: "/images/editorial/product-2.jpg",
    alt: "Do Sakhi — Ivory copper block print co-ord set",
    category: "Co-ords",
    title: "Ivory Copper Co-ord",
    fabric: "Cotton Blend · Block Print",
    sizes: ["S", "M", "L", "XL"],
    price: "₹2,190",
  },
  {
    id: "f3",
    image: "/images/editorial/product-3.jpg",
    alt: "Do Sakhi — Sage green hand embroidered yoke suit with dupatta",
    category: "Suit Sets",
    title: "Sage Yoke Suit Set",
    fabric: "Modal Silk · Hand Embroidery",
    sizes: ["XS", "S", "M", "L"],
    price: "₹3,190",
  },
  {
    id: "f4",
    image: "/images/editorial/product-4.jpg",
    alt: "Do Sakhi — Crimson floral printed suit with dupatta",
    category: "Suit Sets",
    title: "Crimson Garden Suit",
    fabric: "Rayon · Floral Print",
    sizes: ["S", "M", "L", "XL", "XXL"],
    price: "₹2,690",
  },
];

export default async function NewlyCuratedPreview() {
  let products: ProductSummary[] = [];
  let isOffline = false;

  try {
    const response = await apiClient.getProducts({ limit: 4 });
    if (response && Array.isArray(response.data)) {
      products = response.data.slice(0, 4);
    }
  } catch (error) {
    console.error("Backend offline or unreachable during build:", error);
    isOffline = true;
  }

  const showFallback = isOffline || products.length === 0;

  return (
    <section
      aria-label="Newly Curated"
      className="py-20 md:py-28"
      style={{ background: "linear-gradient(180deg, #FAF5EE 0%, #F5EEE4 100%)" }}
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <div
                className="h-px w-8 flex-shrink-0"
                style={{ background: "rgba(167,111,77,0.5)" }}
              />
              <span className="ds-label text-ds-copper">New Arrivals</span>
            </div>
            <h2 className="ds-section-title text-ds-deep-forest">
              Newly Curated
            </h2>
          </div>
          <div className="hidden md:block">
            <Link
              href="/shop"
              className="ds-label text-ds-muted-text underline-offset-4 transition-colors hover:text-ds-copper hover:underline"
            >
              View All Arrivals →
            </Link>
          </div>
        </div>

        {/* ── Fallback: editorial cards with real product images ── */}
        {showFallback ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {editorialFallbackCards.map((card) => (
              <article key={card.id} className="group cursor-pointer p-3 ds-hover-lift rounded-xl transition-colors duration-500 hover:bg-white hover:ds-shadow-luxury">
                {/* Image frame — 4:5 */}
                <div
                  className="relative mb-5 w-full overflow-hidden rounded-lg shadow-sm"
                  style={{ aspectRatio: "4/5" }}
                >
                  {/* "New" badge */}
                  <div className="absolute left-0 top-4 z-20">
                    <span
                      className="ds-glass inline-block px-4 py-1.5 font-sans text-[10px] uppercase tracking-[0.15em] text-ds-charcoal shadow-md"
                    >
                      New
                    </span>
                  </div>

                  {/* Real model image */}
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    className="object-cover object-top transition-transform duration-1000 group-hover:scale-[1.05]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Bottom copper reveal line */}
                  <div
                    className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-700 group-hover:w-full bg-gradient-to-r from-transparent via-ds-copper to-transparent opacity-80"
                  />
                </div>

                {/* Product metadata */}
                <div>
                  <span className="ds-label mb-1 block text-ds-copper/80">
                    {card.category}
                  </span>
                  <h3 className="ds-body mb-1 font-medium leading-tight text-ds-charcoal">
                    {card.title}
                  </h3>
                  <p
                    className="ds-label mb-2 text-ds-muted-text"
                    style={{ textTransform: "none", letterSpacing: "0.02em" }}
                  >
                    {card.fabric}
                  </p>
                  <p className="ds-label mb-3 text-ds-muted-text/60">
                    {card.sizes.join("  ·  ")}
                  </p>
                  {/* Copper separator */}
                  <div
                    className="mb-3 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(167,111,77,0.3) 0%, transparent 100%)",
                      width: "40px",
                    }}
                  />
                  <p
                    className="font-sans font-medium text-ds-deep-forest"
                    style={{ fontSize: "14px", letterSpacing: "0.02em" }}
                  >
                    {card.price}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* ── Live API product grid ── */
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => {
              return (
                <article key={product.id} className="group cursor-pointer p-3 ds-hover-lift rounded-xl transition-colors duration-500 hover:bg-white hover:ds-shadow-luxury">
                  <Link href={`/product/${product.slug || product.id}`} className="block">
                    <div
                      className="relative mb-5 w-full overflow-hidden rounded-lg shadow-sm"
                      style={{ aspectRatio: "4/5" }}
                    >
                      <div className="absolute left-0 top-4 z-20">
                        <span
                          className="ds-glass inline-block px-4 py-1.5 font-sans text-[10px] uppercase tracking-[0.15em] text-ds-charcoal shadow-md"
                        >
                          New
                        </span>
                      </div>

                      <ProductImage
                        image={product.image || null}
                        hoverImage={product.hover_image || null}
                        title={product.title}
                        productIndex={index}
                      />

                      <div
                        className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-700 group-hover:w-full bg-gradient-to-r from-transparent via-ds-copper to-transparent opacity-80"
                      />
                    </div>

                    <div>
                      {product.silhouette && (
                        <span className="ds-label mb-1 block text-ds-copper/80">
                          {formatEnum(product.silhouette)}
                        </span>
                      )}
                      <h3 className="ds-body mb-1 font-medium leading-tight text-ds-charcoal">
                        {product.title}
                      </h3>
                      {product.fabric && (
                        <p
                          className="ds-label mb-2 text-ds-muted-text"
                          style={{ textTransform: "none", letterSpacing: "0.02em" }}
                        >
                          {formatEnum(product.fabric)}
                        </p>
                      )}
                      {product.available_sizes && product.available_sizes.length > 0 && (
                        <p className="ds-label mb-3 text-ds-muted-text/60">
                          {product.available_sizes.join("  ·  ")}
                        </p>
                      )}
                      <div
                        className="mb-3 h-px"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(167,111,77,0.3) 0%, transparent 100%)",
                          width: "40px",
                        }}
                      />
                      <p
                        className="font-sans font-medium text-ds-deep-forest"
                        style={{ fontSize: "14px", letterSpacing: "0.02em" }}
                      >
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-12 text-center md:hidden">
          <Link
            href="/shop"
            className="ds-label text-ds-muted-text underline-offset-4 transition-colors hover:text-ds-copper hover:underline"
          >
            View All Arrivals →
          </Link>
        </div>

      </div>
    </section>
  );
}
