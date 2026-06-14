import AdminShell from "@/components/admin/AdminShell";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:4000/api/v1";

async function getProducts() {
  try {
    const res = await fetch(`${API}/admin/products`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

const STATUS_PILL: Record<string, { bg: string; color: string }> = {
  active:   { bg: "rgba(49,92,72,0.35)",  color: "#7DBE9C" },
  draft:    { bg: "rgba(110,103,95,0.25)", color: "#A09890" },
  archived: { bg: "rgba(138,47,36,0.25)", color: "#D47E73" },
};

export default async function AdminDashboard() {
  const products = await getProducts();

  return (
    <AdminShell>
      <div className="p-10">
        {/* Page header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="text-xs uppercase tracking-[0.2em] mb-2"
              style={{ color: "#A76F4D", fontFamily: "var(--font-sans)" }}
            >
              Catalogue
            </p>
            <h2
              className="text-5xl font-light"
              style={{ fontFamily: "var(--font-serif)", color: "#F8F3EA", lineHeight: 0.9 }}
            >
              Products
            </h2>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-6 py-3 text-sm transition-all duration-300"
            style={{
              background: "#073F34",
              color: "#F8F3EA",
              border: "1px solid rgba(167,111,77,0.35)",
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontSize: "11px",
            }}
          >
            <span className="text-lg" style={{ color: "#A76F4D" }}>+</span>
            Add New Product
          </Link>
        </div>

        {/* Copper divider */}
        <div
          className="mb-8"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, rgba(167,111,77,0.6) 0%, rgba(167,111,77,0.1) 100%)",
          }}
        />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Products", value: products.length },
            { label: "Active",  value: products.filter((p: any) => p.status === "active").length },
            { label: "Drafts",  value: products.filter((p: any) => p.status === "draft").length },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="px-6 py-5 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(167,111,77,0.14)",
              }}
            >
              <p className="text-xs uppercase tracking-[0.15em] mb-2" style={{ color: "#5A5248", fontFamily: "var(--font-sans)" }}>
                {label}
              </p>
              <p className="text-4xl font-light" style={{ fontFamily: "var(--font-serif)", color: "#F8F3EA" }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Product table */}
        {products.length === 0 ? (
          <div
            className="py-24 text-center rounded-lg"
            style={{ border: "1px dashed rgba(167,111,77,0.2)" }}
          >
            <p className="text-3xl font-light mb-3" style={{ fontFamily: "var(--font-serif)", color: "#4A4540" }}>
              No products yet
            </p>
            <p className="text-sm mb-6" style={{ color: "#3E3830", fontFamily: "var(--font-sans)" }}>
              Begin by adding your first product to the catalogue.
            </p>
            <Link
              href="/admin/products/new"
              className="inline-block px-8 py-3 text-xs uppercase tracking-[0.15em]"
              style={{
                background: "rgba(7,63,52,0.6)",
                color: "#A8C5B5",
                border: "1px solid rgba(167,111,77,0.25)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Add First Product
            </Link>
          </div>
        ) : (
          <div
            className="rounded-lg overflow-hidden"
            style={{ border: "1px solid rgba(167,111,77,0.14)" }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(167,111,77,0.12)" }}>
                  {["Product", "Status", "Variants", "Stock", "Price Range", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs uppercase tracking-[0.15em]"
                      style={{ color: "#5A5248", fontFamily: "var(--font-sans)", fontWeight: 500 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p: any, i: number) => {
                  const pill = STATUS_PILL[p.status] || STATUS_PILL.draft;
                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: i < products.length - 1 ? "1px solid rgba(167,111,77,0.08)" : "none",
                        background: "transparent",
                      }}
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded flex-shrink-0 overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                          >
                            {p.thumbnail && !p.thumbnail.includes('cdn.dosakhi.local') ? (
                              <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "#3E3830" }}>
                                ◈
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: "#D4CBC0", fontFamily: "var(--font-sans)" }}>
                              {p.title}
                            </p>
                            <p className="text-xs" style={{ color: "#4A4540", fontFamily: "var(--font-sans)" }}>
                              /{p.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 text-xs uppercase tracking-[0.1em]"
                          style={{
                            background: pill.bg,
                            color: pill.color,
                            fontFamily: "var(--font-sans)",
                            borderRadius: "2px",
                          }}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Variants */}
                      <td className="px-6 py-4 text-sm" style={{ color: "#6E675F", fontFamily: "var(--font-sans)" }}>
                        {p.variant_count}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4 text-sm" style={{ color: "#6E675F", fontFamily: "var(--font-sans)" }}>
                        {p.total_stock}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-sm" style={{ color: "#A09880", fontFamily: "var(--font-sans)" }}>
                        {p.min_price === p.max_price
                          ? `₹${Number(p.min_price).toLocaleString("en-IN")}`
                          : `₹${Number(p.min_price).toLocaleString("en-IN")} – ₹${Number(p.max_price).toLocaleString("en-IN")}`}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <span
                          className="text-xs uppercase tracking-[0.1em] px-3 py-1.5 transition-all cursor-not-allowed opacity-50"
                          title="Edit coming in later admin milestone"
                          style={{
                            color: "#A76F4D",
                          }}
                        >
                          Edit (Coming Soon)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
