import Link from "next/link";

/**
 * Footer — Step 4.2 Luxury Visual Revamp
 *
 * Deep emerald background. Ivory text. Copper line accents.
 * Better spacing and readability. No newsletter logic.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(165deg, #022B24 0%, #033830 50%, #073F34 100%)",
      }}
    >
      {/* Top copper line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(167,111,77,0.4) 30%, rgba(167,111,77,0.6) 50%, rgba(167,111,77,0.4) 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Background weave texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 36px,
              rgba(167,111,77,0.04) 36px,
              rgba(167,111,77,0.04) 37px
            )
          `,
          opacity: 0.5,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-20">

        {/* Brand wordmark top */}
        <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" aria-label="Do Sakhi — return to homepage">
              <span
                className="font-serif font-light tracking-[-0.02em] text-ds-warm-white/90"
                style={{ fontSize: "clamp(28px, 4vw, 38px)", lineHeight: 1 }}
              >
                Do Sakhi
              </span>
            </Link>
            <p
              className="mt-2 font-sans text-ds-muted-sage/55"
              style={{ fontSize: "11px", letterSpacing: "0.18em" }}
            >
              Quiet Luxury · Indian Silhouettes
            </p>
          </div>
          {/* Ornament */}
          <span
            className="hidden font-serif font-light text-ds-copper/20 select-none md:block"
            style={{ fontSize: "40px" }}
            aria-hidden="true"
          >
            ✦
          </span>
        </div>

        {/* Copper separator */}
        <div
          className="mb-14 h-px"
          style={{
            background:
              "linear-gradient(90deg, rgba(167,111,77,0.4) 0%, rgba(167,111,77,0.1) 100%)",
          }}
          aria-hidden="true"
        />

        {/* 4-column links grid */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-8">

          {/* Shop */}
          <div className="flex flex-col gap-1">
            <h4
              className="ds-label mb-4 text-ds-muted-sage"
              style={{ letterSpacing: "0.14em" }}
            >
              Shop
            </h4>
            {["New Arrivals", "Suit Sets", "Co-ords", "Festive Edit"].map((item) => (
              <Link
                key={item}
                href="/shop"
                className="font-sans text-ds-ivory/55 transition-colors duration-200 hover:text-ds-copper"
                style={{ fontSize: "13px", lineHeight: "2.2" }}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Client Services */}
          <div className="flex flex-col gap-1">
            <h4
              className="ds-label mb-4 text-ds-muted-sage"
              style={{ letterSpacing: "0.14em" }}
            >
              Client Services
            </h4>
            {["Stylist Consult", "Size Guide", "Shipping", "Returns & Exchange"].map((item) => (
              <span
                key={item}
                className="cursor-pointer font-sans text-ds-ivory/55 transition-colors duration-200 hover:text-ds-copper"
                style={{ fontSize: "13px", lineHeight: "2.2" }}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Do Sakhi */}
          <div className="flex flex-col gap-1">
            <h4
              className="ds-label mb-4 text-ds-muted-sage"
              style={{ letterSpacing: "0.14em" }}
            >
              Do Sakhi
            </h4>
            {["Our Story", "Lookbooks", "Bespoke", "Contact"].map((item) => (
              <span
                key={item}
                className="cursor-pointer font-sans text-ds-ivory/55 transition-colors duration-200 hover:text-ds-copper"
                style={{ fontSize: "13px", lineHeight: "2.2" }}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-1">
            <h4
              className="ds-label mb-4 text-ds-muted-sage"
              style={{ letterSpacing: "0.14em" }}
            >
              Stay Connected
            </h4>
            <a
              href="#"
              className="font-sans text-ds-ivory/55 transition-colors duration-200 hover:text-ds-copper"
              style={{ fontSize: "13px", lineHeight: "2.2" }}
            >
              Instagram
            </a>
            <a
              href="#"
              className="font-sans text-ds-ivory/55 transition-colors duration-200 hover:text-ds-copper"
              style={{ fontSize: "13px", lineHeight: "2.2" }}
            >
              WhatsApp
            </a>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 flex flex-col gap-3 border-t pt-8 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "rgba(7,63,52,0.6)" }}
        >
          <p
            className="font-sans text-ds-muted-sage/40"
            style={{ fontSize: "11px", letterSpacing: "0.08em" }}
          >
            © {year} Do Sakhi. All rights reserved.
          </p>
          <p
            className="font-sans text-ds-muted-sage/30"
            style={{ fontSize: "10px", letterSpacing: "0.06em" }}
          >
            Crafted with quiet intention.
          </p>
        </div>

      </div>
    </footer>
  );
}
