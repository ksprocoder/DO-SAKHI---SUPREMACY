# Step 10A: Razorpay Payment Architecture + Test Mode Readiness

## 1. Current Payment State
The platform currently supports the customer journey from Homepage to Checkout Review. At the "Continue to Payment" step, a placeholder modal is shown stating that payment architecture is being prepared. No real checkout or order fulfillment is currently taking place.

## 2. Target Razorpay Architecture
1. **Frontend Collection**: Customer completes contact, shipping, and custom tailoring details on the frontend.
2. **Backend Validation**: Frontend sends the payload to `POST /api/v1/checkout/create-payment-order`.
3. **Draft Creation**: Backend validates stock, calculates the authoritative amount server-side, and creates a draft order (`payment_pending`).
4. **Razorpay Order**: Backend calls Razorpay API to create a Razorpay Order and returns safe credentials (`keyId`, `razorpayOrderId`) to the frontend.
5. **Frontend Checkout**: Frontend opens the Razorpay Standard Checkout modal.
6. **Payment Completion**: Customer completes payment and the frontend receives the success response.
7. **Backend Verification**: Frontend sends the Razorpay response to `POST /api/v1/checkout/verify-payment`.
8. **Signature Check**: Backend verifies the Razorpay signature using the secure `key_secret`. If valid, order status changes to `paid`.
9. **Failure Handling**: If the signature is invalid or payment fails, order status remains `payment_pending` or changes to `payment_failed`.

## 3. Frontend Responsibilities
- Collect and validate user details.
- Initiate checkout order creation.
- Load Razorpay Checkout SDK safely.
- Never store or expose sensitive `key_secret` or `webhook_secret`.
- Display a premium, reassuring UI in case of failure or cancellation.

## 4. Backend Responsibilities
- Authoritative calculation of cart totals.
- Locking inventory/stock.
- Storing order drafts safely.
- Communicating with Razorpay APIs securely using `key_secret`.
- Signature verification (never relying on frontend confirmation alone).

## 5. Environment Variables
- `RAZORPAY_KEY_ID`: Used by both frontend (via `NEXT_PUBLIC_`) and backend to identify the merchant account.
- `RAZORPAY_KEY_SECRET`: Used only by backend to sign requests and verify payments.
- `RAZORPAY_WEBHOOK_SECRET`: Used only by backend to verify incoming webhook payloads.
- `RAZORPAY_ENV`: Used by backend to toggle between `test` and `live` modes.
- `PAYMENTS_ENABLED`: Feature flag to disable payment logic during early local development.

## 6. Security Boundaries
- **No Secrets on Frontend**: The frontend only ever sees `NEXT_PUBLIC_RAZORPAY_KEY_ID`.
- **Zero-Trust Frontend**: The backend assumes any payment success message from the frontend could be spoofed, thus relying purely on server-side HMAC signature verification.
- **Server-Side Pricing**: Prices are calculated on the backend from database entries, preventing cart tampering.

## 7. Future Endpoint Plan
- `POST /api/v1/checkout/create-payment-order`: Validates input, locks stock, creates draft order, creates Razorpay order, and returns safe data to launch checkout.
- `POST /api/v1/checkout/verify-payment`: Verifies Razorpay signature and finalizes the order as `paid`.
- `POST /api/v1/checkout/payment-failed`: Safely logs a user cancellation or payment failure against the draft order.

## 8. Order/Payment Status Model
- `cart`: User is shopping.
- `payment_initiated`: Order created, Razorpay order created, waiting for customer to pay.
- `paid`: Payment successfully completed and signature verified by backend.
- `payment_failed`: Payment failed at the gateway or signature verification failed.
- `cancelled`: Customer abandoned the checkout modal.
- `expired`: Time window for stock lock expired before payment completed.

## 9. Error/Failure Handling Plan
- **User Cancellation**: "Payment was not completed. Your order details are still safe."
- **Verification Failure**: "We could not verify the payment securely. Please contact Do Sakhi before retrying."
- **Stock Expiry**: "This piece is no longer available in the selected size."
- All errors shown on the frontend must maintain the "quiet luxury" tone (soft, reassuring, helpful) rather than technical and harsh.

## 10. Database Readiness Review
Currently, the database supports:
- `orders` (with `status` and `payment_status` fields, and `stock_lock_expires_at`).
- `order_items` (with references to variants and prices).
- `custom_tailoring_details` (linked to `order_items`).
*To be implemented in Step 10B/10D*:
- Ensure `orders` table has columns for `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
- Ensure we have a way to log payment events/attempts (e.g., `payment_events` table).

## 11. Test-Mode Setup Checklist
See `docs/razorpay-test-mode-readiness.md` for details.

## 12. Step 10B Implementation Plan
- Implement `POST /api/v1/checkout/create-payment-order` backend logic.
- Integrate the Razorpay Node SDK.
- Update `orders` table schema if necessary.
- Return actual test-mode Razorpay credentials to the frontend.

## 13. Step 10C Implementation Plan
- Implement frontend Razorpay script loader.
- Remove placeholder and open real Razorpay Standard Checkout modal.
- Handle frontend success/failure callbacks.

## 14. What Was Intentionally Not Built
- No actual Razorpay checkout UI was displayed.
- No live payment environments were configured.
- No actual order creation using Razorpay took place.
- No signature verification logic was written.
