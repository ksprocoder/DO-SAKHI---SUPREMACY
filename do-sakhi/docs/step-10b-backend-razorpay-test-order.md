# Step 10B: Backend Draft Order + Razorpay Test Order Creation

## 1. Executive Summary
Step 10B is complete. The backend API now fully supports secure, server-side creation of draft orders and subsequent communication with the Razorpay API to generate test-mode `razorpay_order_id`s. Stock reservations are safely enforced, and all prices are authoritatively recalculated from the database, eliminating the risk of frontend tampering.

## 2. Official Documentation Check
Official Razorpay documentation was verified for:
- Node.js SDK initialization (`new Razorpay({ key_id, key_secret })`).
- Orders API (`razorpay.orders.create(...)`).
- Amount in currency subunits (paise for INR).
- Receipt max limits and notes behavior (kept small and safe).

## 3. What Was Built
- Upgraded the `/checkout` route to `POST /api/v1/checkout/create-payment-order`.
- Enforced strict backend-only calculation of subtotal using `price_inr` directly from the `product_variants` table.
- Added database transactions to lock stock variants using `SELECT ... FOR UPDATE` before processing.
- Persisted order items and any custom tailoring measurements securely to `order_items` and `custom_tailoring_details` tables.
- Added logic to conditionally create a test-mode Razorpay order and update the internal database record with the `gateway_order_id` (via the existing `payment_gateway='razorpay'` column) before returning to the frontend.

## 4. Files Created/Modified
- `[MODIFY]` `apps/api/src/routes/checkout.ts` (Core logic implemented)
- `[MODIFY]` `apps/web/src/lib/api-client.ts` (Renamed checkout endpoint to `createPaymentOrder`)
- `[NO CHANGE]` `package-lock.json` (Razorpay SDK was already installed in Step 10A)
- `[NEW]` `docs/step-10b-backend-razorpay-test-order.md` (This document)

## 5. Endpoint Implemented
`POST /api/v1/checkout/create-payment-order`
This endpoint is the secure boundary for creating both the internal draft order and the external Razorpay payment order.

## 6. Request Payload
```json
{
  "cartId": "uuid-string",
  "contact": {
    "fullName": "Jane Doe",
    "mobile": "9876543210",
    "email": "jane@example.com"
  },
  "address": {
    "addressLine1": "123 Fashion St",
    "city": "Mumbai",
    "state": "MH",
    "pin": "400001",
    "country": "India"
  }
}
```
*(Note: Cart items are fetched securely from the DB using `cartId`. Any items array passed from the frontend is ignored for price calculations.)*

## 7. Response Payload
```json
{
  "success": true,
  "data": {
    "orderId": "internal-uuid",
    "orderNumber": "DS1A2B3C",
    "orderStatus": "payment_initiated",
    "paymentStatus": "pending",
    "amount": {
      "subtotal": 4500,
      "shipping": null,
      "total": 4500,
      "totalPaise": 450000,
      "currency": "INR"
    },
    "razorpay": {
      "keyId": "rzp_test_xxxx",
      "orderId": "order_xxxx",
      "amount": 450000,
      "currency": "INR"
    },
    "stockLockExpiresAt": "2026-06-15T..."
  }
}
```

## 8. Validation Rules
- `contact`: `fullName` (min 1), `mobile` (min 10), `email` (valid or empty string).
- `address`: Requires `addressLine1`, `city`, `state`, `pin` (min 6). `country` defaults to India.
- **Cart**: Ensure `cartId` is a valid UUID, the cart exists, and contains > 0 items.
- **Stock**: Enforces `quantity <= (stock_quantity - reserved_quantity)`.

## 9. Server-Side Amount Calculation
The backend maps over the cart items and retrieves `price_inr` directly from the `product_variants` table. The line total is `Number(variant.price_inr) * item.quantity`. The total amount is then summed and converted to integer paise (`Math.round(totalAmountInr * 100)`) for Razorpay.

## 10. Draft Order Creation
The internal order is generated with:
- `status`: `'payment_initiated'`
- `payment_status`: `'pending'`
- Stock is safely reserved via an `UPDATE product_variants SET reserved_quantity = reserved_quantity + qty` operation, wrapped inside a `BEGIN`/`COMMIT` block.

## 11. Custom Tailoring Persistence
If an item has `tailoring_requested = true` and an associated payload, the measurements (bust, waist, hip, etc.) are successfully recorded in the `custom_tailoring_details` table mapped to the new `order_item_id`.

## 12. Razorpay Test Order Creation
If `PAYMENTS_ENABLED` is true and keys are present, the backend sends a request to the Razorpay API containing the calculated paise amount, currency, and safe metadata (receipt number and notes). The returned `rzpOrder.id` is saved to `orders.gateway_order_id`. If Razorpay fails, the draft order status reverts to `'cancelled'` and stock locks are freed.

## 13. Error Handling
Supported custom error responses:
- `PAYMENTS_DISABLED`: Sent if local environment disables payments entirely.
- `PAYMENTS_NOT_CONFIGURED`: Sent if payments are enabled but keys are missing.
- `VALIDATION_ERROR`: Incorrect payload format.
- `EMPTY_CART`: The cart contains no items.
- `STOCK_UNAVAILABLE`: Someone purchased the last item before checkout completion.
- `RAZORPAY_ORDER_FAILED`: The API call to Razorpay failed, gracefully cancelling the draft.

## 14. Security Checks
- [x] No `RAZORPAY_KEY_SECRET` exposed to frontend.
- [x] No frontend amounts trusted. Prices fetched strictly from `product_variants`.
- [x] Orders are initially marked `pending`, never `paid`.
- [x] No live mode keys are present or can be accidentally triggered.

## 15. Test Results
- ✅ API health check passes.
- ✅ Invalid payload correctly returns `VALIDATION_ERROR`.
- ✅ Empty cart correctly returns `EMPTY_CART`.
- ✅ Stock overbooking correctly returns `STOCK_UNAVAILABLE`.
- ✅ Safe failover when `PAYMENTS_ENABLED=false` returns `PAYMENTS_DISABLED`.
- ✅ Safe failover for missing test keys returns `PAYMENTS_NOT_CONFIGURED`.

## 16. Build and Typecheck Results
- API Typecheck: Passed
- Web Typecheck: Passed
- Web Build: Passed

## 17. Known Limitations
- Frontend Razorpay Checkout modal is NOT built.
- `POST /api/v1/checkout/verify-payment` is NOT built.
- Webhook endpoints are NOT built.
- Success/Failure UI redirects are NOT built.
- WhatsApp automation is NOT built.
- Live mode is NOT activated.

## 18. Strict Boundary Confirmation
- **Confirmed**: No frontend Razorpay window was built.
- **Confirmed**: No Razorpay checkout script was loaded on the frontend.
- **Confirmed**: No payment verification endpoint was built.
- **Confirmed**: No webhook endpoint was built.
- **Confirmed**: No payment was marked paid.
- **Confirmed**: No live payment mode was activated.
- **Confirmed**: No WhatsApp automation was built.
- **Confirmed**: No real keys were committed.
- **Confirmed**: No Step 10C work was started.

## 19. Final Recommendation
Step 10B is complete. Backend draft order and Razorpay test order creation are ready for human review before Step 10C frontend Razorpay Checkout integration begins.
