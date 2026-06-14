# Step 7A Artifact — Luxury Cart Drawer + Global Cart Context

## 1. What Was Built
A premium right-side sliding cart drawer and global cart state management system using React Context and `useReducer`. The system acts as the foundational Cart UX for the Do Sakhi luxury boutique, seamlessly bridging the product detail page (PDP) size selection with cart additions. It tracks quantities, calculates subtotals, and features elegant empty states and micro-feedback toasts.

## 2. Files Created/Modified
**Created:**
- `apps/web/src/components/cart/cart-types.ts`
- `apps/web/src/components/cart/cart-utils.ts`
- `apps/web/src/components/cart/CartProvider.tsx`
- `apps/web/src/components/cart/CartDrawer.tsx`
- `apps/web/src/components/cart/CartLineItem.tsx`
- `apps/web/src/components/cart/CartEmptyState.tsx`
- `apps/web/src/components/cart/CartSummary.tsx`
- `apps/web/src/components/cart/CartToast.tsx`

**Modified:**
- `apps/web/src/components/layout/SiteShell.tsx` (wrapped with `CartProvider`, injected `CartDrawer` and `CartToast`)
- `apps/web/src/components/layout/Header.tsx` (converted to client component, added dynamic cart count indicator)
- `apps/web/src/components/product/ProductInfoPanel.tsx` (wired up 'Add to Cart' flow, integrated `useCart()`)

## 3. Cart State Architecture
The cart utilizes React Context alongside `useReducer` for strict, predictable state mutations (`ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`). 
To ensure hydration safety in Next.js, the local state is initialized to an empty array and hydrated on the client via `useEffect` referencing `localStorage`. This ensures the cart persists across page refreshes without triggering server-client UI mismatch errors.

## 4. Backend Sync Decision
Backend cart API integration (via `routes/cart.ts`) has been purposefully **deferred to the Checkout milestone**. As requested, local state serves as the absolute source of truth for Step 7A to guarantee immediate UI feedback, prevent network latency on critical interactions, and ensure cart functionality operates flawlessly regardless of guest session states or backend availability.

## 5. PDP Add-to-Cart Flow
1. User selects a size (button transitions from "Select Size to Continue" to "Add to Cart").
2. User clicks Add to Cart.
3. Item is pushed to global cart state with explicit variant and sizing data.
4. "Added to Cart" micro-toast appears briefly.
5. Cart drawer automatically slides open showing the newly added piece.

## 6. Cart Drawer UI
A sophisticated, soft-ivory sliding pane overlaying the screen.
- **Empty State:** Features refined typography inviting the user to explore collections.
- **Item List:** Displays items with editorial elegance, showing details like size, color, and selected services.
- **Summary:** Anchors the bottom with the calculated subtotal, shipping disclaimer, and the upcoming checkout CTA.

## 7. Quantity, Remove and Duplicate Handling
- **Duplicate Prevention:** If the same product and variant are added (without custom tailoring), the system intelligently increases the existing item's quantity rather than adding a new row.
- **Quantity Caps:** The plus button respects the variant's total available `maxQuantity` (stock limits).
- **Removal:** A graceful "Remove" action is prioritized over trash can icons. Decrementing quantity stops at `1`, preventing accidental deletion without explicitly pressing "Remove".

## 8. Header Cart Indicator
The global navigation header dynamically tracks the cart count. It subtly displays `Cart (X)` when items are present, acting as a global toggle for the drawer.

## 9. Image Fallback Safety
Cart line items natively support the defensive fallback logic (`isMockImage` and `cdn.dosakhi.local` traps). Invalid image URLs gracefully degrade to the local high-quality `/images/products/fallback/editorial-1.jpg` without layout shifts or broken browser icons.

## 10. Accessibility and Keyboard Behavior
- The drawer backdrop locks the main document scroll (`overflow: hidden`).
- Pressing `Escape` triggers the drawer to close.
- Clicking the dark overlay safely dismisses the drawer.
- The Close button and quantity operators utilize semantic button tags.

## 11. Responsive QA
Designed carefully to span full width on small mobile breakpoints (`< 640px`) while adhering to a strict `480px` maximum width on desktop. Controls are spaced amply for tap targets on iOS/Android.

## 12. Edge Cases Tested
- Opening the cart when completely empty.
- Out-of-stock items disabling the PDP CTA.
- Hydrating a populated cart on a fresh browser reload.
- Clamping quantity increments at maximum available stock.

## 13. Build and Typecheck Results
Cleanly executed across the `apps/web` environment:
- `npm run typecheck`: Passed (No TS errors).
- `npm run build`: Passed successfully (Next.js optimized build completed).

## 14. Known Limitations
- **Checkout / Payment:** Not built (deferred).
- **Custom Tailoring / Measurements:** The data model accepts a boolean flag, but the full intake form is deferred.
- **Wishlist / Login:** Not built.

## 15. Strict Boundary Confirmation
Confirmed that NO checkout UI, payment processing, or admin schema adjustments were made. The milestone scope was strictly adhered to.

---

## 16. Review Request
Step 7A is complete. I have stopped here as instructed. Please review the luxury cart drawer before I proceed to the next milestone.
