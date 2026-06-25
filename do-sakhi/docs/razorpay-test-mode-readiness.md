# Razorpay Test Mode Readiness

## 1. Required Razorpay Test Account Steps
- Create a Razorpay account and log in to the Dashboard.
- Ensure the Dashboard is set to **Test Mode**.
- Navigate to **Settings > API Keys**.
- Generate a new Test Key. You will receive a `Key Id` and `Key Secret`.

## 2. Environment Setup
Populate your local environment files with the test credentials:

**apps/api/.env.local**
```env
PAYMENTS_ENABLED=true
RAZORPAY_ENV=test
RAZORPAY_KEY_ID=rzp_test_YourTestKeyIdHere
RAZORPAY_KEY_SECRET=YourTestKeySecretHere
RAZORPAY_WEBHOOK_SECRET=YourTestWebhookSecretHere
```

**apps/web/.env.local**
```env
NEXT_PUBLIC_PAYMENTS_ENABLED=true
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YourTestKeyIdHere
```

## 3. Keeping Payments Disabled
Until Step 10B/10C are complete, keep `PAYMENTS_ENABLED=false` (or unset) to ensure local development workflows do not crash or behave unexpectedly. The checkout will continue to display the placeholder modal.

## 4. Test Payment Flow Plan
In Step 10C, we will simulate test transactions using Razorpay's standard test cards and UPI handles (e.g., `success@razorpay` or using the test card details provided in Razorpay documentation) to ensure the end-to-end flow handles success smoothly.

## 5. Test Failure/Cancel Plan
We will simulate failures using Razorpay's failure test cards/UPI handles (e.g., `failure@razorpay`) to verify that the frontend displays the correct soft error messaging and the backend correctly registers a failed payment attempt without locking stock indefinitely.

## 6. Future QA Checklist
- Verify success scenario with test card.
- Verify failure scenario with test card.
- Verify user cancellation of the modal.
- Verify backend HMAC signature validation logic with valid and intentionally modified signatures.
- Verify stock locking and expiration logic.

## 7. Things NOT Ready for Live Mode
- Live keys are not configured.
- Webhook endpoints for asynchronous success/failure updates are not built.
- Automated WhatsApp notifications are not implemented.
- Final invoice generation is not implemented.
