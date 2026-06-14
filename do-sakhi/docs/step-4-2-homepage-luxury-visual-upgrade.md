# Step 4.2 — Homepage Luxury Visual Upgrade

## Summary

A complete visual revamp of the Do Sakhi homepage, transforming it from a functional wireframe into a cinematic, editorial, premium boutique experience. All changes are scoped strictly to homepage components, layout, and global styles.

---

## 1. Visual Problems Fixed

| Problem | Fix Applied |
|---|---|
| Hero looked like a blank dark banner — no editorial depth | Rebuilt with split-panel layout, botanical weave texture, ornamental corner lines, copper divider, vertical editorial label |
| Collection cards were flat, single-colour boxes | Replaced with layered gradient panels, large numeral overlays, copper corners, and directional lighting effects |
| Product image frames: no fallback — showed "No Image" text | Replaced with `ds-product-fallback` luxury gradient panels + product initials + `onError` JS handler |
| Atelier section had a tiny ✦ symbol on a plain sage div | Rebuilt as editorial magazine spread: woven-textile gradient panel, FABRIC/FALL/DETAIL labels, copper ornaments |
| Lookbook cards were flat solid-color boxes | Replaced with 3 distinct gradient mood panels (morning sage / office dark forest / evening amber-black) with large numerals |
| BespokeCtaSection was plain centered text | Rebuilt as split dark-emerald editorial block with visual panel, measurement cross, service indicators, and copper accents |
| BoutiquePromise used generic ✦ badges | Replaced with Roman numeral markers (I–IV), copper tick lines, refined typography hierarchy |
| Header felt basic | Added copper top accent line, two-line wordmark with "Quiet Luxury" tagline |
| Footer had poor readability | Added woven texture overlay, copper top line, brand wordmark, improved column hierarchy, editorial brand caption |
| Homepage build failed | Fixed `DYNAMIC_SERVER_USAGE` via `export const dynamic = "force-dynamic"` in `page.tsx` |
| Build failed with event handler error | Removed `onMouseEnter`/`onMouseLeave` from Server Component `Link` — replaced with CSS class `.hero-stylist-cta:hover` |

---

## 2. Files Modified

| File | Change Type |
|---|---|
| `apps/web/src/styles/globals.css` | Extended with fallback panels, ornament frames, lookbook moods, copper line utilities, component hover states |
| `apps/web/src/app/page.tsx` | Added `export const dynamic = "force-dynamic"` |
| `apps/web/src/components/home/HomeHero.tsx` | Full rewrite — cinematic split-panel hero |
| `apps/web/src/components/home/NarrativeCollections.tsx` | Full rewrite — editorial gradient collection cards |
| `apps/web/src/components/home/NewlyCuratedPreview.tsx` | Full rewrite — 4:5 product frames with luxury fallback |
| `apps/web/src/components/home/AtelierStoryBlock.tsx` | Full rewrite — magazine spread with textile panel |
| `apps/web/src/components/home/LookbookPreview.tsx` | Full rewrite — 3 gradient mood frames, asymmetric layout |
| `apps/web/src/components/home/BespokeCtaSection.tsx` | Full rewrite — split emerald editorial conversion block |
| `apps/web/src/components/home/BoutiquePromise.tsx` | Full rewrite — Roman numeral markers, refined hierarchy |
| `apps/web/src/components/layout/Header.tsx` | Polish — copper top line, two-line wordmark |
| `apps/web/src/components/layout/Footer.tsx` | Full rewrite — emerald gradient, copper accents, woven texture |

---

## 3. Section-by-Section Improvements

### Hero (`HomeHero.tsx`)
- Full viewport (`100svh`) editorial split layout
- Left 52%: text with copper eyebrow divider, serif headline with italic treatment, body copy, dual CTAs
- Right 48%: deep emerald botanical panel with woven grid texture, radial warm glow, ornamental corner lines, vertical editorial label, large ✦ serif mark
- Thin copper vertical divider between panels
- Scroll indicator at bottom (desktop)
- CTA hover border brightened via CSS `.hero-stylist-cta:hover` (no JS event handlers — safe in RSC)

### Narrative Collections (`NarrativeCollections.tsx`)
- All plain flat-colour backgrounds replaced with layered gradient panels
- Collection 01 (Suit Sets): sage-to-forest green gradient, 160px numeral, asymmetric large tile
- Collection 02 (Co-ords): warm ivory gradient with dark base overlay
- Collection 03 (Festive Grace): deep amber-brown editorial tone
- Copper corner ornaments on all cards
- Progressive hover: text line extends with copper gradient reveal
- Editorial category tag (Everyday / Modern / Occasion) added

### Newly Curated Preview (`NewlyCuratedPreview.tsx`)
- `4:5` aspect ratio on all product frames (was `3:4`)
- **Fallback strategy**: `ds-product-fallback` CSS class = multi-stop gradient with subtle linen grid texture + inner copper border frame
- Initials derived from product title shown centered in fallback panel
- `onError` handler on `<img>` swaps to hidden fallback `div` on broken URL
- Premium offline fallback: gradient panel with framed ornament + "Coming Soon" label
- Boutique catalogue metadata: silhouette label (copper), title, fabric, sizes, copper separator line, price
- Hover: copper bottom line sweeps across image frame

### Atelier Story Block (`AtelierStoryBlock.tsx`)
- Left panel: woven textile gradient (soft sage → forest green) with repeating grid pattern, ornamental corner frames, 3 editorial labels (FABRIC / FALL / DETAIL) with small horizontal rules, centered ✦ mark
- Right copy: stronger typographic hierarchy, copper divider after headline, second body paragraph, refined CTA with arrow line
- Desktop accent: soft bottom copper gradient line + "Quiet. Considered. Indian." editorial tagline

### Lookbook Preview (`LookbookPreview.tsx`)
- Card 01 (Soft Morning Drape): sage / green gradient — light, airy, natural
- Card 02 (Office Grace): dark forest green — restrained, professional
- Card 03 (Evening Stillness): warm amber-black — rich, still
- Asymmetric magazine grid: Card 01 spans 2 cols + 2 rows on desktop; Cards 02 & 03 stack right
- All cards: large numeral overlay, copper corner ornaments, woven texture, label + title + description
- Progressive line hover reveal on Card 01

### Bespoke CTA Section (`BespokeCtaSection.tsx`)
- Full split layout: copy left (55%), visual editorial panel right (45%)
- Visual panel: deep emerald gradient, woven linen texture, four corner ornaments, centered measurement cross, vertical "Custom Fit" label
- Service indicators: `—` marks with 3 bespoke service descriptions
- Italic serif treatment on headline
- Top and bottom copper gradient lines framing the section

### Boutique Promise (`BoutiquePromise.tsx`)
- Roman numeral markers (I, II, III, IV) in muted copper
- Short copper tick lines beside numerals
- Section title "The Boutique Standard" with serif heading
- Bottom editorial strip: brand note + copper ornament line
- Responsive separator lines between cards on mobile only (hidden on desktop grid)

### Header
- Copper top accent line (gradient fade in/out)
- Two-line wordmark: "Do Sakhi" serif + "Quiet Luxury" copper micro-label
- Slightly reduced nav opacity (75%) for quieter feel
- `button` elements for Search/Account (accessibility)

### Footer
- Deep emerald gradient background (`#022B24 → #073F34`)
- Copper top accent line
- Subtle woven texture overlay
- Brand wordmark at top with "Quiet Luxury · Indian Silhouettes" caption
- Copper separator below wordmark
- 2-column on mobile, 4-column on desktop grid
- Ivory/55 text opacity for links (premium muted feel)
- Bottom: "Crafted with quiet intention." editorial closing line

---

## 4. Media Fallback Strategy

**Problem**: Product images from the database may reference `https://cdn.dosakhi.local/...` mock CDN URLs that do not resolve in any browser.

**Solution** (layered):

1. **CSS fallback class** (`.ds-product-fallback` in `globals.css`):
   - Multi-stop gradient: ivory → soft sage → muted sage (warm textile feel)
   - Subtle linen grid using `repeating-linear-gradient` (very faint copper lines)
   - Inner copper border frame via `::after` pseudo-element
   - Radial warm copper bloom via `::before`

2. **Product initials** derived from product title (first 2 words' initials) shown centered on the fallback panel in muted copper serif.

3. **`Do Sakhi` brand label** shown below initials with copper separator line.

4. **`onError` handler** on `<img>` elements:
   - Hides the broken `<img>` (`display: none`)
   - Reveals the hidden adjacent fallback `div` (`display: flex`)
   - Works without client-side JS because `onError` is an inline HTML event, not a React event handler

5. **Null/empty check**: If `product.image` is `null` or `""`, fallback div is rendered directly without attempting `<img>` at all.

**Result**: No broken image icons, no grey boxes anywhere on the page.

---

## 5. Responsive and Accessibility Review

| Breakpoint | Status |
|---|---|
| Mobile (`< sm`) | Single-column stacked layout on all sections. Hero full viewport. No horizontal overflow. Product cards full-width. |
| Tablet (`sm → md`) | 2-column product grid. Collection cards stacked. Lookbook stacked. |
| Desktop (`md+`) | All asymmetric grids activate. Split layouts. Editorial right panels. |
| Large desktop (`lg+`) | 4-column product grid. 4-column promise grid. |

**Accessibility checks:**
- All interactive links have `id` attributes for browser test targeting
- `aria-label` on header wordmark, cart link, menu button
- `aria-hidden="true"` on all decorative divs and CSS ornaments
- Section `aria-label` preserved on all sections
- `suppressHydrationWarning` on body (from previous fix) handles browser extension conflicts

---

## 6. Terminal Validation Logs

### `npm run typecheck`
```
> do-sakhi-web@0.1.0 typecheck
> tsc --noEmit

(exit 0 — no errors)
```

### `npm run build` (first attempt — failed)
Two errors caught and fixed:
1. `Event handlers cannot be passed to Client Component props` — `onMouseEnter`/`onMouseLeave` removed from `HomeHero.tsx` Link
2. `DYNAMIC_SERVER_USAGE` — `export const dynamic = "force-dynamic"` added to `page.tsx`

### `npm run build` (second attempt — passed)
```
✓ Compiled successfully in 6.0s
✓ Generating static pages (5/5)

Route (app)                        Size    First Load JS
┌ ƒ /                              173 B   105 kB
├ ○ /_not-found                    975 B   102 kB
├ ○ /cart                          141 B   102 kB
├ ƒ /product/[slug]                141 B   102 kB
└ ○ /shop                          141 B   102 kB

(exit 0 — clean build)
```

> [!NOTE]
> `ƒ /` (Dynamic) is the expected and correct output. The homepage is server-rendered on demand because `NewlyCuratedPreview` fetches live product data. This is intentional.

---

## 7. Strict Boundary Confirmation

| Boundary | Status |
|---|---|
| No PLP created | ✅ Confirmed |
| No PDP created | ✅ Confirmed |
| No cart drawer created | ✅ Confirmed |
| No checkout UI created | ✅ Confirmed |
| No tailoring form created | ✅ Confirmed |
| No payment scripts created | ✅ Confirmed |
| No WhatsApp integration created | ✅ Confirmed |
| No backend/database changes made | ✅ Confirmed |
| All changes confined to `apps/web/src/` + `docs/` | ✅ Confirmed |

---

## 8. Review Request

Step 4.2 is complete. I have stopped here as instructed. Please review the upgraded homepage before I proceed to Step 5.
