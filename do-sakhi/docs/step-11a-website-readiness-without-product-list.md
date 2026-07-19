# Step 11A — Website Readiness Without Product List

**Status: COMPLETE**  
**Date:** 2026-06-27  
**Platform:** Do Sakhi — Quiet Luxury E-Commerce  
**Milestone:** Website readiness, polish, and safety improvements before real product catalog upload

---

## 1. Why This Step Was Needed

The previous QA report (Steps 1–10E.5) confirmed:

- The local website works end-to-end (homepage, shop, PDP, cart, checkout, admin)
- Supabase, Cloudflare Workers API, and R2 images are connected
- Production deployment is blocked by Vercel SSO (intentionally)
- Admin panel has no authentication
- Shop/PDP show basic loading skeletons
- Shop page has a hydration warning (searchParams mismatch)
- Admin thumbnails show a generic `◈` symbol when no image is present
- There is no global not-found page
- The real product catalog is not yet available

The correct action: **do not launch, do not disable Vercel SSO, do not invent products**. Improve readiness, safety, polish, and upload preparation instead.

---

## 2. What Was Improved

| Area | Improvement |
|---|---|
| Admin safety | Middleware Basic Auth for `/admin/*` — enabled by env var |
| Shop hydration | Fixed by deferring `searchParams` read to `useEffect` after mount |
| Shop loading | Luxury "Curating the edit" label, staggered skeleton fade-in |
| PDP loading | Luxury "Preparing this piece" label, gallery + info skeleton, thumbnail strip |
| Shop Suspense fallback | Upgraded from plain text to copper ornamental luxury label |
| Admin thumbnail | Product initials monogram (e.g. "DS", "IL") with copper border |
| Not-found (global) | Brand-toned 404 page: "This page is not part of the current edit." |
| Not-found (product) | Polished: "This piece is no longer in the edit. Return to the collection." |
| Product intake template | Expanded with all required fields: SEO, story, photography checklist |
| Image naming guide | Corrected separator from `-` to `_` as per spec; added quality rules, mistakes table |
| Product upload checklist | Created from scratch: 8 sections, 40+ checkboxes, admin upload steps |
| `.env.example` | Added admin protection variable placeholders |

---

## 3. Admin Protection / Preparation

**Implemented: Option A — Middleware Basic Auth**

File: `apps/web/middleware.ts` (new)

- Uses Next.js Edge Middleware with `matcher: ['/admin', '/admin/:path*']`
- Reads credentials from `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables
- Activated only when `ADMIN_PROTECTION_ENABLED=true`
- Currently **disabled** in `.env.local` (not set to `true`) — admin is accessible locally for development
- To activate: set `ADMIN_PROTECTION_ENABLED=true` + set real credentials in `.env.local`
- No credentials are hardcoded or exposed to the frontend
- Public storefront routes are not affected

**To enable Basic Auth locally:**
```env
ADMIN_PROTECTION_ENABLED=true
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_strong_password
```

---

## 4. Public Storefront Status

- **Vercel SSO:** Still active — no change made
- **Production storefront:** Not public — no change made
- **Local dev:** Accessible on `http://localhost:3001` as before
- Admin protection can be enabled without affecting public routes
- Production can be made public only after admin protection is confirmed and product catalog is ready

---

## 5. Loading Polish Changes

### Shop Page (`/shop`)
- **Suspense fallback:** Upgraded from `"Loading collection…"` to copper ornamental line + `"Curating the edit"` label
- **ShopLoadingSkeleton:** Added editorial luxury label ("Curating the edit"), staggered fade-in per card (80ms delay increments), refined shimmer timing (1.8s instead of 1.4s), gentle slide-up entrance animation
- **ShopErrorState:** Copy upgraded to `"The collection could not be arranged right now."`
- **ShopEmptyState:** Ornamental vertical line instead of emoji, refined copy `"Refine the filters or return to the full collection."`

### PDP Page (`/product/[slug]`)
- **ProductLoadingSkeleton:** Added luxury `"Preparing this piece"` label with copper ornamental line, staggered gallery + info panel animation, thumbnail strip skeleton (3 small boxes), smoother fade-in
- **ProductNotFoundState:** Upgraded to `"This piece is no longer in the edit."` with ornamental vertical line, copper divider, expanded CTA `"Return to the Collection"`
- **ProductErrorState:** Copy refined for clarity

---

## 6. Hydration Warning Investigation & Fix

**Root Cause:**
```tsx
// BEFORE — caused hydration mismatch:
const [filters, setFilters] = useState<ShopFilters>(filtersFromUrl());
// filtersFromUrl() reads searchParams synchronously at render time
// On the server: searchParams values may differ from client values
// This produces different initial state → React hydration warning
```

**Fix:**
```tsx
// AFTER — safe for SSR:
const [filters, setFilters] = useState<ShopFilters>(DEFAULT_FILTERS);

// Sync from URL params AFTER hydration (client-only, runs once):
useEffect(() => {
  setFilters(filtersFromUrl());
}, []); // intentionally runs once on mount only
```

**Result:** Initial server render uses `DEFAULT_FILTERS` (matches what client starts with), then URL params are applied client-side after hydration. No mismatch. No warning.

---

## 7. Admin Thumbnail Fallback

**Before:** `◈` symbol in a grey circle when no product image  
**After:** Product initials monogram (e.g. `"IL"` for "Ivory Leaf...") in a serif font with copper color and subtle copper border

```tsx
{(p.title || 'DS')
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((w: string) => w[0].toUpperCase())
  .join('')}
```

Row height is consistent. Table alignment is maintained. Border added for visual structure even when no image is present.

---

## 8. 404 / Invalid Route Behavior

| Route | Expected | Actual |
|---|---|---|
| `/random-invalid-page` | Global 404 — premium | ✅ HTTP 404 — "This page is not part of the current edit." |
| `/product/non-existent-piece` | Product not-found — premium | ✅ HTTP 200 — `ProductNotFoundState` shown client-side |
| `/admin` | Redirect to admin dashboard | ✅ HTTP 307 → `/admin/products` |
| `/admin/non-existent` | Admin 404 or redirect | ✅ Middleware handles, then 404 page shown |

No raw stack traces. No ugly crash screens. Global `not-found.tsx` renders with full brand styling.

---

## 9. Product Upload Preparation

Three documents created/updated:

### `docs/do-sakhi-product-intake-template.md` (updated)
- 8 sections: General Info, Pricing & Inventory, Details & Specifications, Premium Copy, SEO Information, Photography Checklist, Notes, Upload Checklist
- New fields added: SEO Title, SEO Description, Premium Product Story, Occasion, Fit/Silhouette, Short Description
- Photography checklist with exact file names per row

### `docs/do-sakhi-image-naming-guide.md` (updated)
- **Breaking fix:** Separator corrected from `-` to `_` (was `emerald-jute-co-ord-front.jpg`, now `emerald-jute-co-ord_front.jpg`)
- Added quality rules table (aspect ratio, resolution, file size, format)
- Added "Common Mistakes" table
- Added upload order instructions

### `docs/do-sakhi-product-upload-checklist.md` (new)
- 8 sections, 40+ checkboxes
- Covers: information, sizing, pricing, copy, SEO, images, admin upload steps (9 steps), quality check
- Clear rule: "Set status to **Draft** by default. Move to **Active** only after quality check passes."

---

## 10. Admin Product Upload Flow QA

| Admin Route | Status |
|---|---|
| `/admin/products` | ✅ HTTP 200 — products list page loads |
| `/admin/products/new` | ✅ HTTP 200 — add product form loads |
| `/admin/import` | ✅ HTTP 200 — Excel import page loads |

- Empty product state shows "No products yet" with "Add First Product" button
- Import page has file upload (.xlsx/.xls) + preview + commit flow
- Thumbnail fallback now shows product initials instead of `◈`
- Status pills (Active/Draft/Archived) render with correct colors
- Stats row shows Total Products / Active / Drafts counts

---

## 11. Browser and Viewport QA

**Server:** Production build served on `http://localhost:3002`

| Route | HTTP Code | Result |
|---|---|---|
| `/` | 200 | ✅ Homepage loads |
| `/shop` | 200 | ✅ Contains "Curating the edit" |
| `/product/non-existent-piece` | 200 | ✅ Client renders `ProductNotFoundState` |
| `/admin` | 307 | ✅ Redirects to `/admin/products` |
| `/admin/products` | 200 | ✅ Admin panel loads |
| `/admin/import` | 200 | ✅ Import page loads |
| `/cart` | 200 | ✅ Cart loads |
| `/checkout` | 200 | ✅ Checkout loads |
| `/random-invalid-page` | 404 | ✅ Premium "This page is not part of the current edit." |

**Viewport QA:** Not automatable (Chrome DevTools not available on macOS). Manual verification recommended at 375px, 768px, 1440px before product catalog upload.

---

## 12. Security Checks

- ✅ No secrets committed or hardcoded
- ✅ Admin credentials stored in env vars only (`.env.example` has placeholder values)
- ✅ Vercel SSO not disabled
- ✅ Production storefront not made public
- ✅ No Razorpay logic touched
- ✅ No live payment activated
- ✅ No fake products added
- ✅ No WhatsApp automation built
- ✅ No invoice/refund flow built

---

## 13. Bugs Found and Fixed

| # | Bug | Fix |
|---|---|---|
| 1 | Shop page hydration warning from `useState(filtersFromUrl())` reading `searchParams` during render | Changed to `useState(DEFAULT_FILTERS)` + `useEffect` to sync after mount |
| 2 | Admin thumbnails showing generic `◈` symbol with grey box | Replaced with product initials monogram (copper serif font) |
| 3 | No global not-found page — Next.js default used | Created `app/not-found.tsx` with brand aesthetic |
| 4 | Shop loading copy was "Loading collection…" (plain) | Upgraded to "Curating the edit" with copper ornamental line |
| 5 | PDP loading had no copy — just a blank shimmer | Added "Preparing this piece" luxury editorial label |
| 6 | Image naming guide used hyphen separator (`-`) — spec requires underscore (`_`) | Corrected to `product-slug_front.jpg` format |
| 7 | Product upload checklist did not exist | Created `docs/do-sakhi-product-upload-checklist.md` |

---

## 14. Files Modified

| File | Action |
|---|---|
| `apps/web/middleware.ts` | **NEW** — Admin Basic Auth middleware |
| `apps/web/.env.example` | Modified — Added admin protection env vars |
| `apps/web/src/app/not-found.tsx` | **NEW** — Global premium 404 page |
| `apps/web/src/app/(shop)/shop/page.tsx` | Modified — Luxury Suspense fallback |
| `apps/web/src/components/shop/ShopClient.tsx` | Modified — Hydration warning fix |
| `apps/web/src/components/shop/ShopStates.tsx` | Modified — Luxury loading polish |
| `apps/web/src/components/product/ProductStates.tsx` | Modified — Luxury PDP states |
| `apps/web/src/app/(admin)/admin/products/page.tsx` | Modified — Product initials thumbnail fallback |
| `docs/do-sakhi-product-intake-template.md` | Modified — Expanded with all required fields |
| `docs/do-sakhi-image-naming-guide.md` | Modified — Fixed separator, added quality rules |
| `docs/do-sakhi-product-upload-checklist.md` | **NEW** — Full pre-upload checklist |

---

## 15. Build and Typecheck Results

### TypeScript Typecheck
```
> do-sakhi-web@0.1.0 typecheck
> tsc --noEmit

✅ No errors
```

### Production Build
```
> do-sakhi-web@0.1.0 build
> next build

▲ Next.js 16.2.9 (Turbopack)

✓ Compiled successfully in 36.4s
  Running TypeScript ...
  Finished TypeScript in 30.3s ...
✓ Generating static pages (8/8) in 1079ms

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ○ /admin
├ ○ /admin/import
├ ƒ /admin/products
├ ○ /admin/products/new
├ ○ /cart
├ ƒ /checkout
├ ƒ /product/[slug]
└ ○ /shop

ƒ Proxy (Middleware)   ← Admin Basic Auth middleware registered
✅ Build PASSED — No errors
```

---

## 16. Known Limitations

- **Real product catalog:** Still pending. No products have been uploaded.
- **Vercel SSO:** Still active on production. Storefront is not public.
- **Admin Basic Auth:** Implemented but currently disabled locally (`ADMIN_PROTECTION_ENABLED` not set to `true` in `.env.local`). Must be manually enabled before production admin access.
- **Viewport QA:** Automated browser QA not available on macOS. Manual viewport testing recommended.
- **Razorpay test-key QA:** Pending until real test keys are configured.
- **Live payment:** Not active.
- **Full public launch:** Not ready.

---

## 17. Next Recommended Milestone

### Option A (Recommended): Step 11B — Real Product Catalog Upload
Once product data and photography are available:
- Use `docs/do-sakhi-product-upload-checklist.md` as the guide
- Use `docs/do-sakhi-product-intake-template.md` to prepare each product
- Upload front image first in admin
- Set products to Draft, review each at `/product/[slug]`, then set Active

### Option B: Step 11B — Admin Protection Finalization
If admin protection should be enabled before product upload:
- Set `ADMIN_PROTECTION_ENABLED=true` in `.env.local`
- Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` with strong values
- Test that Basic Auth prompt appears on `/admin/*`
- Test that public routes are unaffected
- Document for Vercel environment variables

---

## 18. Strict Boundary Confirmation

- ✅ No live Razorpay payment activated
- ✅ Vercel SSO not disabled
- ✅ No fake products added
- ✅ No WhatsApp automation built
- ✅ No invoice or refund flow built
- ✅ No production launch performed
- ✅ No Step 10F payment hardening work started
- ✅ No real admin credentials committed anywhere
