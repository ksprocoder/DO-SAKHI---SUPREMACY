# Step 5B: Luxury Shop Page / PLP — Summary

## Route
`/shop` → `apps/web/src/app/(shop)/shop/page.tsx`

## Files Created

| File | Role |
| :--- | :--- |
| `src/components/shop/shop-utils.ts` | Shared types, constants, helpers (normalize, sort, filter) |
| `src/components/shop/ProductImage.tsx` | Image with fallback system |
| `src/components/shop/ProductCard.tsx` | Luxury product card |
| `src/components/shop/ProductGrid.tsx` | 3-col grid with editorial interlude |
| `src/components/shop/ShopHero.tsx` | Editorial header |
| `src/components/shop/ShopToolbar.tsx` | Sort + count + active chips |
| `src/components/shop/ShopFilters.tsx` | Desktop sidebar filters |
| `src/components/shop/MobileFilterDrawer.tsx` | Mobile bottom-sheet drawer |
| `src/components/shop/ShopStates.tsx` | Loading/error/empty states |
| `src/components/shop/ShopClient.tsx` | Main shop client logic |
| `src/app/(shop)/shop/page.tsx` | Server component entry point |

## API Integration

- `GET /api/v1/products?limit=100`
- Response normalized defensively via `normalizeProduct()`
- Client-side filter + sort applied (backend collection filter has schema mismatch: uses non-existent `p.collection_id` column)

## Filter System

| Filter | Method |
| :--- | :--- |
| Category | Client-side on `product_type` |
| Size | Client-side on `available_sizes` |
| Colour | Client-side on `colour` |
| Occasion | Client-side on tags |
| Custom Fit | Client-side on `custom_tailoring_available` |
| Availability | Client-side on `is_ready_to_ship` |
| Price Range | Client-side on `price` |
| Sort | Client-side |

## Image Fallback Strategy

1. Check validity of image URL (not null, not fake CDN, valid protocol)
2. On load error → use editorial fallback from `/images/editorial/`
3. Rotate 10 fallback images by product index
4. No broken icons, no grey boxes

## States

- **Loading**: shimmer skeleton grid, 6 cards
- **Error**: "We could not load the collection" + retry button
- **Empty**: "No pieces found for this selection" + clear filters button

## Responsive

- Desktop (md+): 3-col grid + sidebar
- Tablet/Mobile: 2-col grid, sidebar hidden, bottom-sheet filter drawer

## Build

```
✓ Compiled successfully in 24.0s
✓ Generating static pages (9/9)
/shop  8.71 kB  119 kB First Load JS
```

## TypeScript

```
npm run typecheck → 0 errors
```

## Boundaries Confirmed

- No PDP, no cart, no checkout, no payment, no WhatsApp built
- No backend changes made
- No DB schema changes
