"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Variant {
  id: string; // local key only
  sku: string;
  colorName: string;
  colorHex: string;
  sizeLabel: string;
  sizeNumeric: string;
  priceInr: string;
  compareAtPriceInr: string;
  costPriceInr: string;
  stockQuantity: string;
  lowStockThreshold: string;
}

interface MediaItem {
  id: string;
  mediaType: "image" | "video";
  mediaRole: string;
  url: string;
  altText: string;
  position: number;
  isPrimary: boolean;
  localPreview?: string; // for locally selected files
}

const RIBBON_OPTIONS = [
  "", "READY TO SHIP", "CUSTOM FIT AVAILABLE", "LIMITED PIECE", "MADE TO ORDER",
];

const SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free Size"];
const MEDIA_ROLES  = ["front", "back", "side", "lifestyle", "fabric_closeup", "drape_video", "embroidery_detail", "pocket_detail"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2); }

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="mb-5">
        <h3
          className="text-2xl font-light mb-1"
          style={{ fontFamily: "var(--font-serif)", color: "#D4CBC0" }}
        >
          {title}
        </h3>
        {sub && (
          <p className="text-xs uppercase tracking-[0.12em]" style={{ color: "#5A5248", fontFamily: "var(--font-sans)" }}>
            {sub}
          </p>
        )}
        <div className="mt-3" style={{ height: "1px", background: "linear-gradient(90deg, rgba(167,111,77,0.5) 0%, transparent 80%)" }} />
      </div>
      {children}
    </div>
  );
}

// ─── Input Components ─────────────────────────────────────────────────────────

const inputCls = `
  w-full px-4 py-3 text-sm bg-transparent outline-none transition-all duration-200
  placeholder:text-[#3E3830]
`;
const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(167,111,77,0.2)",
  color: "#D4CBC0",
  fontFamily: "var(--font-sans)",
  borderRadius: "2px",
};
const inputFocusStyle = {
  borderColor: "rgba(167,111,77,0.55)",
};

function Field({
  label, required, hint, children,
}: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-xs uppercase tracking-[0.12em] mb-2"
        style={{ color: "#7A7268", fontFamily: "var(--font-sans)" }}
      >
        {label} {required && <span style={{ color: "#A76F4D" }}>*</span>}
      </label>
      {children}
      {hint && <p className="text-xs mt-1" style={{ color: "#4A4540", fontFamily: "var(--font-sans)" }}>{hint}</p>}
    </div>
  );
}

function Input({
  value, onChange, placeholder, type = "text", required,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={inputCls}
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}) }}
    />
  );
}

function Textarea({
  value, onChange, placeholder, rows = 4,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`${inputCls} resize-none`}
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}) }}
    />
  );
}

function Select({
  value, onChange, options,
}: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
      style={{ ...inputStyle, cursor: "pointer" }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: "#0D1512" }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ─── Variant Row ──────────────────────────────────────────────────────────────

function VariantRow({
  variant, onChange, onRemove, index,
}: {
  variant: Variant;
  onChange: (id: string, field: keyof Variant, value: string) => void;
  onRemove: (id: string) => void;
  index: number;
}) {
  const set = (field: keyof Variant) => (v: string) => onChange(variant.id, field, v);

  return (
    <div
      className="p-5 mb-3 rounded"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(167,111,77,0.14)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase tracking-[0.12em]" style={{ color: "#A76F4D", fontFamily: "var(--font-sans)" }}>
          Variant {index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(variant.id)}
          className="text-xs px-2 py-1 transition-all"
          style={{ color: "#8A2F24", border: "1px solid rgba(138,47,36,0.3)", fontFamily: "var(--font-sans)" }}
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Size quick-select */}
        <Field label="Size">
          <div className="flex gap-2 flex-wrap mb-2">
            {SIZE_PRESETS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set("sizeLabel")(s)}
                className="px-3 py-1 text-xs transition-all"
                style={{
                  background: variant.sizeLabel === s ? "rgba(167,111,77,0.25)" : "transparent",
                  border: `1px solid ${variant.sizeLabel === s ? "rgba(167,111,77,0.6)" : "rgba(167,111,77,0.15)"}`,
                  color: variant.sizeLabel === s ? "#D4C5B0" : "#5A5248",
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.08em",
                  borderRadius: "2px",
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <Input value={variant.sizeLabel} onChange={set("sizeLabel")} placeholder="Or type custom size" required />
        </Field>

        <Field label="SKU" required>
          <Input value={variant.sku} onChange={set("sku")} placeholder="DS-PROD-COLOR-SIZE" required />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <Field label="Original Price (₹)" required hint="The full / compare-at price">
          <Input value={variant.compareAtPriceInr} onChange={set("compareAtPriceInr")} placeholder="5000" type="number" />
        </Field>
        <Field label="Selling Price (₹)" required hint="What customer pays">
          <Input value={variant.priceInr} onChange={set("priceInr")} placeholder="3500" type="number" required />
        </Field>
        <Field label="Cost Price (₹)" hint="Your production cost (private)">
          <Input value={variant.costPriceInr} onChange={set("costPriceInr")} placeholder="1500" type="number" />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Stock Quantity" required>
          <Input value={variant.stockQuantity} onChange={set("stockQuantity")} placeholder="20" type="number" required />
        </Field>
        <Field label="Low Stock Alert at">
          <Input value={variant.lowStockThreshold} onChange={set("lowStockThreshold")} placeholder="2" type="number" />
        </Field>
        <Field label="Colour Name">
          <Input value={variant.colorName} onChange={set("colorName")} placeholder="Ivory" />
        </Field>
      </div>
    </div>
  );
}

// ─── Media Row ────────────────────────────────────────────────────────────────

function MediaRow({
  item, onChange, onRemove, index,
}: {
  item: MediaItem;
  onChange: (id: string, field: keyof MediaItem, value: any) => void;
  onRemove: (id: string) => void;
  index: number;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    onChange(item.id, "localPreview", preview);
    onChange(item.id, "mediaType", file.type.startsWith("video") ? "video" : "image");
    if (!item.altText) onChange(item.id, "altText", file.name.replace(/\.[^.]+$/, ""));

    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:4000/api/v1"}/admin/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(item.id, "url", data.url);
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Upload error: " + err);
    }
  };

  return (
    <div
      className="flex gap-4 p-4 mb-3 rounded"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(167,111,77,0.12)",
      }}
    >
      {/* Preview thumbnail */}
      <div
        className="w-20 h-20 flex-shrink-0 rounded overflow-hidden flex items-center justify-center cursor-pointer"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px dashed rgba(167,111,77,0.25)" }}
        onClick={() => fileRef.current?.click()}
      >
        {item.localPreview ? (
          <img src={item.localPreview} alt="" className="w-full h-full object-cover" />
        ) : item.url && !item.url.startsWith("[uploaded") ? (
          <img src={item.url} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl" style={{ color: "#3E3830" }}>📷</span>
        )}
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
      </div>

      {/* Fields */}
      <div className="flex-1 grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs uppercase tracking-[0.1em] mb-1 block" style={{ color: "#5A5248", fontFamily: "var(--font-sans)" }}>
            URL or Click Thumbnail to Upload
          </label>
          <input
            type="text"
            value={item.url}
            onChange={(e) => onChange(item.id, "url", e.target.value)}
            placeholder="https://cdn.dosakhi.com/…"
            className="w-full px-3 py-2 text-xs"
            style={{ ...inputStyle, color: "#A09880" }}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.1em] mb-1 block" style={{ color: "#5A5248", fontFamily: "var(--font-sans)" }}>
            Role
          </label>
          <select
            value={item.mediaRole}
            onChange={(e) => onChange(item.id, "mediaRole", e.target.value)}
            className="w-full px-3 py-2 text-xs"
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            {MEDIA_ROLES.map((r) => (
              <option key={r} value={r} style={{ background: "#0D1512" }}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.1em] mb-1 block" style={{ color: "#5A5248", fontFamily: "var(--font-sans)" }}>
            Alt Text
          </label>
          <input
            type="text"
            value={item.altText}
            onChange={(e) => onChange(item.id, "altText", e.target.value)}
            placeholder="Describe the image…"
            className="w-full px-3 py-2 text-xs"
            style={inputStyle}
          />
        </div>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={item.isPrimary}
              onChange={(e) => onChange(item.id, "isPrimary", e.target.checked)}
              style={{ accentColor: "#A76F4D" }}
            />
            <span className="text-xs uppercase tracking-[0.1em]" style={{ color: "#6E675F", fontFamily: "var(--font-sans)" }}>
              Primary Image
            </span>
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="self-start text-xs px-2 py-1"
        style={{ color: "#8A2F24", border: "1px solid rgba(138,47,36,0.3)", fontFamily: "var(--font-sans)" }}
      >
        ✕
      </button>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:4000/api/v1";

function newVariant(): Variant {
  return { id: uid(), sku: "", colorName: "", colorHex: "", sizeLabel: "", sizeNumeric: "", priceInr: "", compareAtPriceInr: "", costPriceInr: "", stockQuantity: "0", lowStockThreshold: "2" };
}
function newMedia(): MediaItem {
  return { id: uid(), mediaType: "image", mediaRole: "front", url: "", altText: "", position: 0, isPrimary: false };
}

export default function NewProductPage() {
  const router = useRouter();

  // ── Core fields
  const [title, setTitle]               = useState("");
  const [slug, setSlug]                 = useState("");
  const [slugManual, setSlugManual]     = useState(false);
  const [shortDesc, setShortDesc]       = useState("");
  const [description, setDescription]   = useState("");
  const [ribbon, setRibbon]             = useState("");

  // ── Classification
  const [productType, setProductType]   = useState("suit_set");
  const [status, setStatus]             = useState("draft");
  const [fulfillment, setFulfillment]   = useState("ready_to_ship");
  const [customTailoring, setCustomTailoring] = useState(false);
  const [madeToOrder, setMadeToOrder]   = useState(false);

  // ── Fabric & Silhouette
  const [fabricType, setFabricType]     = useState("");
  const [fabricComp, setFabricComp]     = useState("");
  const [fabricFeel, setFabricFeel]     = useState("");
  const [care, setCare]                 = useState("");
  const [fitNote, setFitNote]           = useState("");
  const [silhouette, setSilhouette]     = useState("");
  const [neckline, setNeckline]         = useState("");
  const [sleeve, setSleeve]             = useState("");
  const [kurtiLen, setKurtiLen]         = useState("");
  const [bottomType, setBottomType]     = useState("");
  const [dupatta, setDupatta]           = useState(false);
  const [pocket, setPocket]             = useState(false);
  const [embroidery, setEmbroidery]     = useState("");
  const [printDetail, setPrintDetail]   = useState("");

  // ── Timing & SEO
  const [leadMin, setLeadMin]           = useState("2");
  const [leadMax, setLeadMax]           = useState("7");
  const [seoTitle, setSeoTitle]         = useState("");
  const [seoDesc, setSeoDesc]           = useState("");
  const [collectionSlugs, setCollectionSlugs] = useState<string>("");

  // ── Variants & Media
  const [variants, setVariants]         = useState<Variant[]>([newVariant()]);
  const [media, setMedia]               = useState<MediaItem[]>([newMedia()]);

  // ── Submission state
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [success, setSuccess]           = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugManual) setSlug(slugify(v));
  };

  // Variant helpers
  const updateVariant = useCallback((id: string, field: keyof Variant, value: string) => {
    setVariants((prev) => prev.map((v) => v.id === id ? { ...v, [field]: value } : v));
  }, []);
  const removeVariant = useCallback((id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  }, []);
  const addVariant = () => setVariants((prev) => [...prev, newVariant()]);

  // Media helpers
  const updateMedia = useCallback((id: string, field: keyof MediaItem, value: any) => {
    setMedia((prev) => prev.map((m) => m.id === id ? { ...m, [field]: value } : m));
  }, []);
  const removeMedia = useCallback((id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  }, []);
  const addMedia = () => setMedia((prev) => [...prev, { ...newMedia(), position: prev.length }]);

  // Bulk size builder
  const addSizeRow = (size: string) => {
    // Only add if not already present
    if (variants.some((v) => v.sizeLabel === size)) return;
    setVariants((prev) => [...prev, { ...newVariant(), sizeLabel: size }]);
  };

  // ── Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      title, slug,
      shortDescription: shortDesc || undefined,
      description: description || undefined,
      ribbon: ribbon || undefined,
      productType, status,
      fulfillmentType: fulfillment,
      isReadyToShip: fulfillment === "ready_to_ship",
      isMadeToOrder: madeToOrder,
      customTailoringAvailable: customTailoring,
      fabricType: fabricType || undefined,
      fabricComposition: fabricComp || undefined,
      fabricFeel: fabricFeel || undefined,
      careInstructions: care || undefined,
      fitNote: fitNote || undefined,
      silhouette: silhouette || undefined,
      neckline: neckline || undefined,
      sleeveType: sleeve || undefined,
      kurtiLength: kurtiLen || undefined,
      bottomType: bottomType || undefined,
      dupatteIncluded: dupatta,
      pocketAvailable: pocket,
      embroideryDetail: embroidery || undefined,
      printDetail: printDetail || undefined,
      leadTimeMinDays: parseInt(leadMin) || 2,
      leadTimeMaxDays: parseInt(leadMax) || 7,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDesc || undefined,
      collectionSlugs: collectionSlugs.split(",").map((s) => s.trim()).filter(Boolean),
      tags: [],
      variants: variants.map((v) => ({
        sku: v.sku,
        colorName: v.colorName || "Default",
        colorHex: v.colorHex || undefined,
        sizeLabel: v.sizeLabel,
        sizeNumeric: v.sizeNumeric || undefined,
        priceInr: parseFloat(v.priceInr),
        compareAtPriceInr: v.compareAtPriceInr ? parseFloat(v.compareAtPriceInr) : undefined,
        costPriceInr: v.costPriceInr ? parseFloat(v.costPriceInr) : undefined,
        stockQuantity: parseInt(v.stockQuantity) || 0,
        lowStockThreshold: parseInt(v.lowStockThreshold) || 2,
      })),
      media: media
        .filter((m) => m.url)
        .map((m, i) => ({
          mediaType: m.mediaType,
          mediaRole: m.mediaRole,
          url: m.url,
          altText: m.altText || undefined,
          position: i,
          isPrimary: m.isPrimary,
        })),
    };

    try {
      const res = await fetch(`${API}/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create product");
        setSaving(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/admin/products"), 1200);
    } catch {
      setError("Network error — is the API running?");
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto px-10 py-10">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "#A76F4D", fontFamily: "var(--font-sans)" }}>
            Catalogue › Add
          </p>
          <h2
            className="text-5xl font-light leading-none mb-2"
            style={{ fontFamily: "var(--font-serif)", color: "#F8F3EA" }}
          >
            New Product
          </h2>
          <p className="text-sm" style={{ color: "#5A5248", fontFamily: "var(--font-sans)" }}>
            All fields marked <span style={{ color: "#A76F4D" }}>*</span> are required.
          </p>
        </div>

        {/* Success Banner */}
        {success && (
          <div
            className="mb-6 px-5 py-4 text-sm"
            style={{
              background: "rgba(49,92,72,0.3)",
              border: "1px solid rgba(49,92,72,0.6)",
              color: "#7DBE9C",
              fontFamily: "var(--font-sans)",
            }}
          >
            ✓ Product created successfully — redirecting…
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div
            className="mb-6 px-5 py-4 text-sm"
            style={{
              background: "rgba(138,47,36,0.2)",
              border: "1px solid rgba(138,47,36,0.45)",
              color: "#D47E73",
              fontFamily: "var(--font-sans)",
            }}
          >
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">

          {/* ── IDENTITY ────────────────────────────────────────────── */}
          <Section title="Product Identity" sub="Title, subtitle and display ribbon">
            <div className="grid grid-cols-1 gap-4">
              <Field label="Product Title" required>
                <Input value={title} onChange={handleTitleChange} placeholder="Ivory Leaf Print Summer Suit Set" required />
              </Field>

              <Field label="Slug (URL)" required hint="Auto-generated from title. Lowercase letters, numbers and hyphens only.">
                <Input
                  value={slug}
                  onChange={(v) => { setSlug(v); setSlugManual(true); }}
                  placeholder="ivory-leaf-print-summer-suit-set"
                  required
                />
              </Field>

              <Field label="Subtitle / Short Description" hint="Shown below title on product cards">
                <Input value={shortDesc} onChange={setShortDesc} placeholder="A classic ivory leaf print suit set for summer days." />
              </Field>

              <Field label="Ribbon / Badge" hint="Appears as a small badge on the product card and PDP">
                <Select
                  value={ribbon}
                  onChange={setRibbon}
                  options={RIBBON_OPTIONS.map((r) => ({ value: r, label: r || "— No Ribbon —" }))}
                />
              </Field>

              <Field label="Full Product Description" hint="Detailed markdown-friendly description for the PDP">
                <Textarea value={description} onChange={setDescription} placeholder="Describe the product in detail — fabric, story, styling notes…" rows={6} />
              </Field>
            </div>
          </Section>

          {/* ── CLASSIFICATION ──────────────────────────────────────── */}
          <Section title="Classification" sub="Product type, status and fulfilment method">
            <div className="grid grid-cols-3 gap-4">
              <Field label="Product Type" required>
                <Select
                  value={productType}
                  onChange={setProductType}
                  options={[
                    { value: "suit_set", label: "Suit Set" },
                    { value: "co_ord_set", label: "Co-ord Set" },
                    { value: "kurta_set", label: "Kurta Set" },
                    { value: "lehenga", label: "Lehenga" },
                    { value: "saree", label: "Saree" },
                    { value: "top", label: "Top" },
                    { value: "dupatta", label: "Dupatta" },
                    { value: "other", label: "Other" },
                  ]}
                />
              </Field>

              <Field label="Status">
                <Select
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: "draft", label: "Draft (Hidden)" },
                    { value: "active", label: "Active (Live)" },
                    { value: "archived", label: "Archived" },
                  ]}
                />
              </Field>

              <Field label="Fulfilment Type">
                <Select
                  value={fulfillment}
                  onChange={(v) => { setFulfillment(v); setMadeToOrder(v === "made_to_order"); }}
                  options={[
                    { value: "ready_to_ship", label: "Ready to Ship" },
                    { value: "made_to_order", label: "Made to Order" },
                    { value: "custom_tailoring", label: "Custom Tailoring" },
                  ]}
                />
              </Field>
            </div>

            <div className="flex gap-6 mt-4">
              {[
                { label: "Custom Tailoring Available", val: customTailoring, set: setCustomTailoring },
                { label: "Dupatta Included", val: dupatta, set: setDupatta },
                { label: "Pockets Available", val: pocket, set: setPocket },
              ].map(({ label, val, set }) => (
                <label key={label} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={(e) => set(e.target.checked)}
                    style={{ accentColor: "#A76F4D" }}
                  />
                  <span className="text-xs uppercase tracking-[0.1em]" style={{ color: "#6E675F", fontFamily: "var(--font-sans)" }}>
                    {label}
                  </span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Field label="Lead Time Min (days)">
                <Input value={leadMin} onChange={setLeadMin} type="number" placeholder="2" />
              </Field>
              <Field label="Lead Time Max (days)">
                <Input value={leadMax} onChange={setLeadMax} type="number" placeholder="7" />
              </Field>
            </div>
          </Section>

          {/* ── FABRIC & DETAILS ─────────────────────────────────────── */}
          <Section title="Fabric & Details" sub="Material, silhouette and care">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Field label="Fabric Type">
                <Input value={fabricType} onChange={setFabricType} placeholder="cotton_blend" />
              </Field>
              <Field label="Fabric Composition">
                <Input value={fabricComp} onChange={setFabricComp} placeholder="80% Cotton, 20% Linen" />
              </Field>
              <Field label="Fabric Feel">
                <Input value={fabricFeel} onChange={setFabricFeel} placeholder="Soft and breathable" />
              </Field>
              <Field label="Silhouette">
                <Input value={silhouette} onChange={setSilhouette} placeholder="straight / anarkali / a_line" />
              </Field>
              <Field label="Neckline">
                <Input value={neckline} onChange={setNeckline} placeholder="v_neck / round_neck" />
              </Field>
              <Field label="Sleeve Type">
                <Input value={sleeve} onChange={setSleeve} placeholder="three_quarter / sleeveless" />
              </Field>
              <Field label="Kurti Length">
                <Input value={kurtiLen} onChange={setKurtiLen} placeholder="calf_length / knee_length" />
              </Field>
              <Field label="Bottom Type">
                <Input value={bottomType} onChange={setBottomType} placeholder="palazzo / straight_pant" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Embroidery / Work Detail">
                <Textarea value={embroidery} onChange={setEmbroidery} placeholder="Zari border, block print…" rows={3} />
              </Field>
              <Field label="Print Detail">
                <Textarea value={printDetail} onChange={setPrintDetail} placeholder="Botanical leaf print, hand-block…" rows={3} />
              </Field>
            </div>
            <Field label="Care Instructions">
              <Textarea value={care} onChange={setCare} placeholder="Dry clean only. Do not tumble dry." rows={2} />
            </Field>
            <div className="mt-4">
              <Field label="Fit Note" hint="Displayed on PDP to guide size selection">
                <Input value={fitNote} onChange={setFitNote} placeholder="True to size. Model is 5'6&quot; wearing size M." />
              </Field>
            </div>
          </Section>

          {/* ── PRODUCT IMAGES ───────────────────────────────────────── */}
          <Section title="Product Images & Media" sub="Upload or paste CDN URLs. First 'front' image appears on cards.">
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={addMedia}
                className="px-4 py-2 text-xs uppercase tracking-[0.12em] transition-all"
                style={{
                  background: "rgba(7,63,52,0.5)",
                  border: "1px solid rgba(167,111,77,0.3)",
                  color: "#A8C5B5",
                  fontFamily: "var(--font-sans)",
                }}
              >
                + Add Image / Video
              </button>
              <p className="text-xs self-center" style={{ color: "#4A4540", fontFamily: "var(--font-sans)" }}>
                Click thumbnail to upload from your computer, or paste a URL directly.
              </p>
            </div>

            {media.map((item, i) => (
              <MediaRow key={item.id} item={item} onChange={updateMedia} onRemove={removeMedia} index={i} />
            ))}
          </Section>

          {/* ── VARIANTS (SIZES + PRICING + STOCK) ───────────────────── */}
          <Section title="Sizes, Pricing & Inventory" sub="Each row = one size / colour combination">
            {/* Quick size adder */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ color: "#5A5248", fontFamily: "var(--font-sans)" }}>
                Quick-add sizes
              </p>
              <div className="flex gap-2 flex-wrap">
                {SIZE_PRESETS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addSizeRow(s)}
                    className="px-4 py-2 text-xs transition-all"
                    style={{
                      background: variants.some((v) => v.sizeLabel === s)
                        ? "rgba(167,111,77,0.2)"
                        : "transparent",
                      border: `1px solid ${variants.some((v) => v.sizeLabel === s) ? "rgba(167,111,77,0.5)" : "rgba(167,111,77,0.15)"}`,
                      color: variants.some((v) => v.sizeLabel === s) ? "#C4A882" : "#5A5248",
                      fontFamily: "var(--font-sans)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {variants.map((v, i) => (
              <VariantRow key={v.id} variant={v} onChange={updateVariant} onRemove={removeVariant} index={i} />
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="mt-2 px-5 py-2 text-xs uppercase tracking-[0.12em] transition-all"
              style={{
                background: "transparent",
                border: "1px dashed rgba(167,111,77,0.3)",
                color: "#A76F4D",
                fontFamily: "var(--font-sans)",
                width: "100%",
              }}
            >
              + Add Variant Row
            </button>
          </Section>

          {/* ── COLLECTIONS & SEO ───────────────────────────────────── */}
          <Section title="Collections & SEO" sub="Assign collections and set search metadata">
            <div className="grid grid-cols-1 gap-4">
              <Field label="Collection Slugs" hint="Comma-separated. e.g: suit-sets, new-arrivals">
                <Input value={collectionSlugs} onChange={setCollectionSlugs} placeholder="suit-sets, new-arrivals, the-summer-edit" />
              </Field>
              <Field label="SEO Title" hint="Defaults to product title if left blank">
                <Input value={seoTitle} onChange={setSeoTitle} placeholder="Buy Ivory Leaf Summer Suit Set — Do Sakhi" />
              </Field>
              <Field label="SEO Description">
                <Textarea value={seoDesc} onChange={setSeoDesc} placeholder="Boutique ivory leaf print summer suit set…" rows={3} />
              </Field>
            </div>
          </Section>

          {/* ── SUBMIT ──────────────────────────────────────────────── */}
          <div
            className="sticky bottom-0 -mx-10 px-10 py-5 flex items-center justify-between"
            style={{
              background: "linear-gradient(0deg, #0A1210 70%, transparent 100%)",
              borderTop: "1px solid rgba(167,111,77,0.14)",
            }}
          >
            <p className="text-xs" style={{ color: "#4A4540", fontFamily: "var(--font-sans)" }}>
              Status: <span style={{ color: status === "active" ? "#7DBE9C" : "#A09880" }}>{status}</span>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              {variants.length} variant{variants.length !== 1 ? "s" : ""}
              &nbsp;&nbsp;·&nbsp;&nbsp;
              {media.filter((m) => m.url).length} image{media.filter((m) => m.url).length !== 1 ? "s" : ""}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStatus("draft")}
                className="px-6 py-3 text-xs uppercase tracking-[0.15em] transition-all"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(167,111,77,0.25)",
                  color: "#7A7268",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={saving}
                onClick={() => setStatus("active")}
                className="px-8 py-3 text-xs uppercase tracking-[0.15em] transition-all disabled:opacity-50"
                style={{
                  background: saving ? "rgba(7,63,52,0.5)" : "#073F34",
                  border: "1px solid rgba(167,111,77,0.4)",
                  color: "#D4CBC0",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {saving ? "Publishing…" : "Publish Product"}
              </button>
            </div>
          </div>

        </form>
      </div>
    </AdminShell>
  );
}
