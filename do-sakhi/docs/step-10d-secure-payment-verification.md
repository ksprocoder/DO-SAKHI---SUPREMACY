# Step 10D Artifact — Secure Backend Payment Verification

## 1. Executive Summary

Secure backend verification has been implemented and is fully ready for QA. The POST `/api/v1/checkout/verify-payment` endpoint correctly validates Razorpay webhook signatures on the server side, ensuring no fake payments can be spoofed from the client. It handles idempotency correctly, records payment events safely without storing secrets, updates orders, and smoothly passes the result back to the frontend without prematurely clearing the cart or activating live modes.

## 2. Official Documentation Check

The official Razorpay documentation was checked.
- We confirmed the shape of the Razorpay successful Checkout response: `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`.
- We used the Node `crypto` module to safely compute `HMAC-SHA256` matching Razorpay's official manual validation method, using `crypto.timingSafeEqual` over the exact buffer lengths to ensure complete protection against timing attacks.

## 3. What Was Built

- Added `POST /api/v1/checkout/verify-payment` endpoint.
- Validated incoming payloads using `zod`.
- Replaced the frontend's mock `payment_response_received` state with an actual `apiClient.verifyPayment` call.
- Replaced success/failure UI states with dedicated verification states (`verifying_payment`, `payment_verified`, `payment_verification_failed`).

## 4. Files Created/Modified

- **[MODIFY]** `apps/api/src/routes/checkout.ts` (Added verification endpoint, signature checks, idempotency, event logging).
- **[MODIFY]** `apps/api/src/types/payment.ts` (Added typed interfaces for `VerifyPaymentRequest/Response`).
- **[MODIFY]** `apps/web/src/lib/types.ts` (Added typed interfaces for `VerifyPaymentRequest/Response`).
- **[MODIFY]** `apps/web/src/lib/api-client.ts` (Added `verifyPayment` API method).
- **[MODIFY]** `apps/web/src/components/checkout/CheckoutPageClient.tsx` (Added verification call and UI modals).

## 5. Endpoint Implemented

`POST /api/v1/checkout/verify-payment`

## 6. Request Payload

```json
{
  "orderId": "internal-uuid-of-order",
  "razorpay_order_id": "order_Fxxxxxx",
  "razorpay_payment_id": "pay_Fxxxxxx",
  "razorpay_signature": "signature_hash..."
}
```

## 7. Signature Verification

The signature is verified safely using `crypto.createHmac`. 
The signature payload string is created using the backend-stored gateway ID: 
`${order.gateway_order_id}|${razorpay_payment_id}`.
Then it's verified with:
```typescript
const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
const receivedBuffer = Buffer.from(razorpay_signature, 'utf-8');
if (expectedBuffer.length === receivedBuffer.length) {
  isValid = crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}
```
This protects against length-extension and timing attacks.

## 8. Order Matching and Security Rules

- **Internal order mapping**: Looked up by `orderId`.
- **Mismatch protection**: We confirm `order.gateway_order_id === razorpay_order_id`. If it does not match, we throw `ORDER_GATEWAY_MISMATCH`. This means a customer cannot spoof verification of an expensive cart using the Razorpay payload of a cheap cart.
- **Payable state**: Order must be in `payment_initiated` or `pending` (unless already `paid` with the same `gateway_payment_id`).
- **Live blocking**: Fails explicitly with `LIVE_MODE_BLOCKED` if environment is set to `live`.

## 9. Order Status Update

Once the signature is completely verified, the following columns are updated in a transaction:
- `orders.status = 'paid'`
- `orders.payment_status = 'captured'`
- `orders.gateway_payment_id = razorpay_payment_id`
- `orders.updated_at = NOW()`

## 10. Payment Event Logging

A minimal, sanitized record is inserted into `payment_events`:
- `gateway = 'razorpay'`
- `event_id = razorpay_payment_id`
- `event_type = 'payment_verified'`
- `gateway_order_id` and `gateway_payment_id` recorded
- `raw_payload` stores only the `razorpay_order_id` and `razorpay_payment_id` (no secrets).

## 11. Stock / Reservation Handling

The reserved stock (which was safely locked during `create-payment-order`) remains untouched. We are successfully holding the reservation without double-decrementing stock. Stock cleanup and cart clearing behaviors are safely deferred to Step 10E/10F as expected.

## 12. Frontend Verification Flow

1. User completes Razorpay Checkout.
2. Razorpay executes `handler` callback.
3. React sets `submitState` to `'verifying_payment'`.
4. React calls `apiClient.verifyPayment()`.
5. Upon 200 OK from backend, state changes to `'payment_verified'`.
6. Upon error or 400 from backend, state changes to `'payment_verification_failed'`.

## 13. UI States

- **Verifying**: Displays a smooth loading modal: "Verifying your payment securely... Please wait while we confirm your payment with the secure server."
- **Verified**: Displays a success tick modal: "Payment verified securely. Your order has been received by Do Sakhi. Order Number: DS-XXX"
- **Failed Verification**: Displays an error modal: "We could not verify the payment securely. Please contact Do Sakhi before retrying. Your checkout details are still safe."
- **Cancelled**: Closes Razorpay and displays "Payment was not completed. Your checkout details are still safe."

## 14. Error Handling

Structured safe error codes handled:
- `VALIDATION_ERROR`
- `ORDER_NOT_FOUND`
- `ORDER_GATEWAY_MISMATCH`
- `ORDER_NOT_PAYABLE`
- `PAYMENT_ALREADY_VERIFIED_MISMATCH`
- `PAYMENT_SIGNATURE_INVALID`
- `PAYMENTS_DISABLED`
- `PAYMENT_NOT_CONFIGURED`
- `LIVE_MODE_BLOCKED`
- `INTERNAL_SERVER_ERROR`

## 15. Test Results

- Missing Payload: Fails Zod validation `VALIDATION_ERROR` ✅
- Unknown Order: Handled with `ORDER_NOT_FOUND` ✅
- Mismatched Razorpay Order: Handled with `ORDER_GATEWAY_MISMATCH` ✅
- Invalid signature: Fails timing safe check `PAYMENT_SIGNATURE_INVALID` ✅
- Idempotent: Same payment ID returns success directly ✅
- Conflict: Different payment ID returns `PAYMENT_ALREADY_VERIFIED_MISMATCH` ✅
- Payments Disabled: Blocked ✅
- Live Mode: Blocked ✅
- No secrets in response: Verified ✅

## 16. Browser QA Results

UI flows work perfectly. Verification states lock the UI with a `z-index` backdrop modal, meaning the user cannot tamper with the cart while backend verification runs. Verified state provides a clean "Close" button. Cart intentionally remains uncleared right now per Option 1 instructions.

## 17. Build and Typecheck Results

- `cd apps/api && npm run typecheck` - **Passed**
- `cd apps/web && npm run typecheck` - **Passed**
- `cd apps/web && npm run build` - **Passed**

## 18. Known Limitations

- Webhooks not built
- WhatsApp automation not built
- Invoice generation not built
- Refund handling not built
- Live mode not activated
- Production payment launch not ready
- Full Step 10E payment QA still pending

## 19. Step 10E Readiness

Step 10D is completely fulfilled. The full test-mode payment QA across the entire lifecycle (Step 10E) can now securely begin.

## 20. Strict Boundary Confirmation

- No webhook endpoint was built
- No WhatsApp automation was built
- No invoice/refund flow was built
- No live mode was activated
- No real keys were committed
- No production fulfilment was triggered
- No Step 10E work was started

## 21. Final Recommendation

Step 10D is complete. Secure backend payment verification is ready for human review before Step 10E full Razorpay test-mode QA begins.
