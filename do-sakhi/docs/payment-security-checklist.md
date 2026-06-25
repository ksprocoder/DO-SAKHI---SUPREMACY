# Payment Security Checklist

## 1. Secret Management
- [ ] `RAZORPAY_KEY_SECRET` is never exposed in frontend code (`NEXT_PUBLIC_` or otherwise).
- [ ] `RAZORPAY_WEBHOOK_SECRET` is never exposed in frontend code.
- [ ] Production secrets are stored securely in environment variables (Vercel/Render), not in `.env` files committed to Git.

## 2. Test/Live Separation
- [ ] Distinct Razorpay accounts or environments are used for `test` and `live` modes.
- [ ] The application has a strong `RAZORPAY_ENV` check that explicitly prevents `live` mode operation unless specifically approved.

## 3. Server-Side Execution
- [ ] **Amount Calculation**: The backend strictly recalculates order total based on DB prices; it never trusts the total sent by the frontend.
- [ ] **Signature Verification**: Order status is ONLY updated to `paid` if the backend successfully verifies the HMAC-SHA256 signature generated using the `key_secret`.
- [ ] **Webhook Verification**: Webhook payloads are verified using the `webhook_secret` before processing.

## 4. Tampering & Replay Prevention
- [ ] Payment verification endpoints check if the `orderId` is already marked as `paid` to prevent double processing or replay attacks.
- [ ] Stock reservations are locked securely and expire if payment is not completed within the timeout window.

## 5. Failure & Cancel Handling
- [ ] Failed payments are handled gracefully without altering the user's cart in a destructive way if retry is permitted.
- [ ] Cancellations properly update the order state to `cancelled` or `payment_failed` and release stock locks if applicable.

## 6. Data Storage & Logging
- [ ] Sensitive card/UPI details are NEVER stored. We rely completely on Razorpay's tokenization and secure infrastructure.
- [ ] Logs NEVER print `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, or full customer PII unmasked.

## 7. Production Readiness Gating
- [ ] A formal sign-off step is required before flipping `PAYMENTS_ENABLED=true` and `RAZORPAY_ENV=live` in production.
