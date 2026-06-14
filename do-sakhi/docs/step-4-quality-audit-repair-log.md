# Step 4 Quality Audit & Repair Log

**Project:** Do Sakhi — Custom Quiet-Luxury Fashion E-Commerce Platform  
**Phase:** Step 4 QA — Homepage Editorial UI Testing, Evaluation & Auto-Fix  
**Date:** 2026-06-03  
**Methodology:** Review-Driven Development (RDD) — QA before Step 5

---

## 1. Blueprint Reference Used

**Do Sakhi — Final Master Blueprint.md** was used as the sole authoritative source.

Chapters referenced:

| Chapter | Purpose |
|---|---|
| **Chapter 1 — The Visual & Emotional Identity** | Validated quiet-luxury visual identity, typography hierarchy (serif/sans-serif roles), colour system, spacing/whitespace, homepage editorial rhythm, exact copy strings |
| **Chapter 2 — Frontend Viewport Architecture** | Validated viewport responsiveness, homepage section flow, confirmed no PLP/PDP scope leakage |
| **Chapter 5 — API & System Integration Blueprint** | Validated API client usage, `GET /api/v1/products` contract, paginated response shape `{ data, pagination, availableFilters }` |

---

## 2. Component Completeness Checklist

All 7 required homepage editorial sections are confirmed to exist, are correctly named, imported, and rendered **in the exact required order**.

| # | Section | Component File | Status |
|---|---|---|---|
| 1 | Full-Bleed Hero | `HomeHero.tsx` | ✅ Present & correct order |
| 2 | Narrative Collection Blocks | `NarrativeCollections.tsx` | ✅ Present & correct order |
| 3 | Newly Curated Preview | `NewlyCuratedPreview.tsx` | ✅ Present & correct order |
| 4 | Craftsmanship / Atelier Story | `AtelierStoryBlock.tsx` | ✅ Present & correct order |
| 5 | Lookbook Preview | `LookbookPreview.tsx` | ✅ Present & correct order |
| 6 | Bespoke / Custom Tailoring CTA | `BespokeCtaSection.tsx` | ✅ Present & correct order |
| 7 | Boutique Promise | `BoutiquePromise.tsx` | ✅ Present & correct order |

`apps/web/src/app/page.tsx` — composition order confirmed correct. All 7 imports present.

---

## 3. Design System Alignment

### Token Usage Audit

| Token | Used Correctly | Notes |
|---|---|---|
| `bg-ds-ivory` | ✅ | NewlyCuratedPreview, LookbookPreview section backgrounds |
| `bg-ds-warm-white` | ✅ | NarrativeCollections, BoutiquePromise, product fallback |
| `bg-ds-deep-forest` | ✅ | BespokeCtaSection background |
| `bg-ds-soft-sage` | ✅ | AtelierStoryBlock bg, product card placeholder, promise icon |
| `bg-ds-muted-sage` | ✅ | Lookbook card placeholders |
| `text-ds-copper` | ✅ | Eyebrow labels in AtelierStoryBlock, LookbookPreview, BespokeCtaSection |
| `text-ds-charcoal` | ✅ | Main body text throughout |
| `text-ds-deep-forest` | ✅ | Section titles throughout |
| `text-ds-muted-text` | ✅ | Fabric labels, promise descriptions |
| `border-ds-border` | ✅ | BoutiquePromise top border, product fallback border |
| `.ds-hero-title` | ✅ | HomeHero `<h1>` |
| `.ds-section-title` | ✅ | All section `<h2>` and narrative `<h3>` titles |
| `.ds-body` | ✅ | All body paragraphs |
| `.ds-label` | ✅ | All eyebrow text, metadata, product labels |

### Typography Discipline

| Rule | Status |
|---|---|
| Serif only for editorial headings | ✅ Confirmed |
| Sans-serif for labels, body, CTAs, prices, metadata | ✅ Confirmed |
| Price displayed in `ds-body` (sans-serif, never serif) | ✅ Fixed |
| No hardcoded hex values in Step 4 component files | ✅ None found |
| No rogue colour classes (bg-red-*, text-blue-*, bg-yellow-*) | ✅ None found |
| Generous spacing maintained (mobile py-16+, desktop py-24+) | ✅ Confirmed |

### Fixes Applied to Design Tokens

- **`NarrativeCollections.tsx`** — Replaced raw `font-serif text-3xl` on right-column `<h3>` elements with `.ds-section-title` utility. Now token-compliant.
- **`AtelierStoryBlock.tsx`** — Changed section background from `bg-ds-warm-white` to `bg-ds-soft-sage` per blueprint Ch1.10 ("Soft sage or warm ivory" for craftsmanship blocks).
- **`BoutiquePromise.tsx`** — Promise description text overrides `ds-label` uppercase/tracking so descriptions read as prose (correct UX practice).

---

## 4. API Data Binding

### `NewlyCuratedPreview.tsx` Contract Audit

| Check | Status |
|---|---|
| Uses `apiClient.getProducts({ limit: 4 })` | ✅ |
| Reads `response.data` array (not raw array assumption) | ✅ Guarded with `Array.isArray(response.data)` |
| Handles `{ data, pagination, availableFilters }` shape | ✅ |
| No assumption product detail is wrapped in `data` | ✅ (product detail not used here) |
| `product.image` is optional-safe (`?` conditional render) | ✅ |
| `product.hover_image` not accessed (not needed on homepage) | ✅ |
| `product.price` safely handles `string | number` type | ✅ `typeof product.price === 'number'` guard |
| `product.available_sizes` safely accessed with length check | ✅ |
| Try/catch wraps entire fetch — build never crashes if offline | ✅ |
| Graceful fallback message shown when offline/empty | ✅ "Newly curated pieces will appear here..." |
| No add-to-cart implementation | ✅ |
| No wishlist implementation | ✅ |
| No filter controls | ✅ |

### `api-client.ts` Fix

- Added `cache: 'no-store'` to `fetchHelper` so Next.js SSR never attempts to statically pre-render the page with a cached failed API response. This converts the homepage route from `○ (Static)` to `ƒ (Dynamic)` — correct behavior for live boutique data.

---

## 5. Responsive Integrity

### Layout checks per viewport

| Breakpoint | Hero | Narrative Blocks | Product Preview | Atelier | Lookbook | Bespoke | Promise |
|---|---|---|---|---|---|---|---|
| **Mobile (< 640px)** | `min-h-[78vh]`, stacked content | Single column, full-width tiles | 1-col product grid | Stacked image+text | Stacked 1-col | Full-width CTAs | 1-col promise items |
| **Tablet (640–768px)** | `min-h-[78vh]` | 1-col progressing to 2 | 2-col `sm:grid-cols-2` | Stacked | Stacked + aspect ratio | 2-col CTAs via `sm:flex-row` | 2-col `sm:grid-cols-2` |
| **Desktop (768px+)** | `min-h-[92vh]`, left-aligned content | 5-col grid (3+2 asymmetric) | 4-col `lg:grid-cols-4` | 2-col split | 3-col editorial grid | Centered max-w-4xl | 4-col `lg:grid-cols-4` |
| **XL (1280px+)** | Content max-w-7xl, 7vw left margin | max-w-7xl constrained | max-w-7xl | max-w-7xl | max-w-7xl | max-w-4xl centered | max-w-7xl |

### Responsive Fixes Applied

- **`NarrativeCollections.tsx`** — Switched from `grid-cols-2` to a `grid-cols-5` system (3+2) to properly implement the blueprint's 60%/40% asymmetric editorial split on desktop. Mobile remains single column.
- **`LookbookPreview.tsx`** — First lookbook card now uses `md:col-span-2 md:min-h-[420px]` so it is wide on desktop. Mobile uses `aspect-[4/3]` on the first card to avoid collapse. Other cards use `aspect-[3/4]`.
- **`HomeHero.tsx`** — Added `md:pl-[7vw]` left margin for desktop per blueprint Ch1.8 content placement ("Margin left: 7vw").
- No horizontal overflow risks found. All text blocks have `max-w-*` constraints.

---

## 6. Build Sanity Results

### `npx tsc --noEmit`
```
✅ Exit code 0 — No TypeScript errors
```

### `npm run build`
```
▲ Next.js 15.3.3
✓ Compiled successfully in 14.0s
✓ Linting and checking validity of types ...
✓ Generating static pages (6/6)

Route (app)                  Size    First Load JS
ƒ /                          173 B   105 kB         ← Dynamic (correct: async server component)
○ /_not-found                975 B   102 kB
○ /cart                      141 B   102 kB
ƒ /product/[slug]            141 B   102 kB
○ /shop                      141 B   102 kB

✅ Build completed successfully — Exit code 0
```

> **Note on `ƒ (Dynamic)`:** The homepage is correctly classified as Dynamic because `NewlyCuratedPreview` uses `cache: 'no-store'` for live boutique data. This is intentional and correct behavior per blueprint requirements (live product preview). The "Backend offline" console message during build is the graceful `try/catch` catching the offline API — not a build error.

### `npm run lint`
Not run separately — ESLint is configured in `next.config.ts` with `ignoreDuringBuilds: false`. The successful build confirms linting passed as part of the build pipeline.

---

## 7. Errors or Deviations Found

| # | File | Issue | Severity | Fix Applied |
|---|---|---|---|---|
| 1 | `.next/` (cache) | Stale/corrupted webpack runtime (`Cannot find module './400.js'`) causing all homepage requests to return 500 | **CRITICAL** | Deleted `.next/` directory entirely; clean rebuild |
| 2 | `package.json` (root) | `dev:web` script was accidentally overwritten with `dev:api` during previous session | **HIGH** | Restored both scripts (`dev:web` and `dev:api`) |
| 3 | `NarrativeCollections.tsx` | Right-column `<h3>` used raw `font-serif text-3xl` — violates design token discipline | **MEDIUM** | Replaced with `.ds-section-title` utility |
| 4 | `NarrativeCollections.tsx` | Used `grid-cols-2` instead of asymmetric 60/40 layout per blueprint Ch1.9 | **MEDIUM** | Changed to `grid-cols-5` (col-span-3 + col-span-2) |
| 5 | `AtelierStoryBlock.tsx` | Background was `bg-ds-warm-white` — blueprint Ch1.10 specifies "soft sage" | **LOW** | Changed to `bg-ds-soft-sage` |
| 6 | `api-client.ts` | `fetch()` had no `cache` directive — caused Next.js to attempt static generation with failed API, producing `DYNAMIC_SERVER_USAGE` digest warning | **MEDIUM** | Added `cache: 'no-store'` to `fetchHelper` |
| 7 | `HomeHero.tsx` | Desktop content alignment missing `md:pl-[7vw]` margin per blueprint Ch1.8 | **LOW** | Added `md:pl-[7vw]` to content wrapper |
| 8 | `LookbookPreview.tsx` | First card lacked wide layout on desktop (blueprint requires editorial wide-card) | **LOW** | Added `md:col-span-2 md:min-h-[420px]` |
| 9 | `NewlyCuratedPreview.tsx` | Product card missing explicit badge display, available sizes display, and price safety check | **LOW** | Added all three with correct typography treatment |

---

## 8. Code Fixes Applied

| File | What Changed |
|---|---|
| `apps/web/src/components/home/HomeHero.tsx` | Added `md:pl-[7vw]` desktop margin, added explicit `uppercase tracking-widest` to eyebrow as belt-and-suspenders, added `focus:ring` a11y states, cleaned aria-labels |
| `apps/web/src/components/home/NarrativeCollections.tsx` | Switched grid to `grid-cols-5` (3+2) for 60/40 asymmetric layout. Replaced raw `font-serif text-3xl` h3 with `.ds-section-title`. CTAs changed to underlined text links per blueprint. |
| `apps/web/src/components/home/NewlyCuratedPreview.tsx` | Added badge display, available_sizes display, price safety guard, product image optional-safe rendering. Added `aria-label` and `<article>` semantic element. |
| `apps/web/src/components/home/AtelierStoryBlock.tsx` | Changed background from `bg-ds-warm-white` to `bg-ds-soft-sage`. Refined visual placeholder. Added `aria-label`. |
| `apps/web/src/components/home/LookbookPreview.tsx` | First card now `md:col-span-2 md:min-h-[420px]`. Fixed mobile aspect ratios. Added proper `shrink-0` on CTA container. |
| `apps/web/src/components/home/BespokeCtaSection.tsx` | Added `focus:ring-offset-ds-deep-forest` for dark background a11y. Added `aria-label`. Replaced `space-y/space-x` with `gap-*` for cleaner flex layout. |
| `apps/web/src/components/home/BoutiquePromise.tsx` | Added `key` by `id` field (not index). Added `flex-col items-start` alignment. Prose description override on ds-label text transform. |
| `apps/web/src/lib/api-client.ts` | Added `cache: 'no-store'` to `fetchHelper` to prevent static generation caching of failed API responses |
| `package.json` (root) | Restored `dev:web` script alongside `dev:api` |
| `.next/` (directory) | **Deleted entirely** — stale webpack artifact was causing `MODULE_NOT_FOUND ./400.js` 500 errors on homepage |

---

## 9. Strict Boundary Confirmation

The following were **NOT** created, modified, or touched during this QA pass:

| Boundary | Status |
|---|---|
| Product Listing Page (PLP) | ✅ Not touched |
| Product Detail Page (PDP) | ✅ Not touched |
| Cart drawer | ✅ Not touched |
| Checkout UI | ✅ Not touched |
| Custom tailoring form overlay | ✅ Not touched |
| Razorpay / Stripe payment scripts | ✅ Not touched |
| WhatsApp integration | ✅ Not touched |
| Admin dashboard | ✅ Not touched |
| Backend (`apps/api/`) | ✅ Not touched |
| Database schema | ✅ Not touched |
| `database/` directory | ✅ Not touched |

Only files within the permitted QA scope were modified:
- `apps/web/src/components/home/*.tsx`
- `apps/web/src/lib/api-client.ts`
- `package.json` (root, scripts only)
- `docs/` (this file)

---

## 10. Review Request

**Step 4 QA is complete. I have stopped here as instructed. Please review the homepage quality audit before I proceed to Step 5.**
