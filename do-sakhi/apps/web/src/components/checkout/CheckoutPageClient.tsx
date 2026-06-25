'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '../cart/CartProvider';
import { CheckoutHeader } from './CheckoutHeader';
import { ContactDetailsForm } from './ContactDetailsForm';
import { ShippingAddressForm } from './ShippingAddressForm';
import { CheckoutOrderSummary } from './CheckoutOrderSummary';
import { CheckoutTrustNote } from './CheckoutTrustNote';
import { CheckoutEmptyState } from './CheckoutEmptyState';
import {
  EMPTY_CONTACT,
  EMPTY_ADDRESS,
  loadCheckoutDraft,
  saveCheckoutDraft,
  validateAll,
  hasErrors,
} from './checkout-utils';
import type {
  CheckoutContactForm,
  CheckoutAddressForm,
  CheckoutFormErrors,
  CheckoutFormTouched,
} from './checkout-types';
import { apiClient } from '../../lib/api-client';
import { loadRazorpayScript } from '../../lib/razorpay-loader';

const EMPTY_ERRORS: CheckoutFormErrors = { contact: {}, address: {} };
const EMPTY_TOUCHED: CheckoutFormTouched = { contact: {}, address: {} };

type SubmitState = 'idle' | 'validating' | 'creating_order' | 'loading_razorpay' | 'checkout_opened' | 'verifying_payment' | 'payment_verified' | 'payment_verification_failed' | 'payment_cancelled' | 'payment_error';

export function CheckoutPageClient() {
  const { items, isHydrated, toggleCart } = useCart();

  // ─── Form state ─────────────────────────────────────────────────────────
  const [contact, setContact] = useState<CheckoutContactForm>(EMPTY_CONTACT);
  const [address, setAddress] = useState<CheckoutAddressForm>({ ...EMPTY_ADDRESS, country: 'India' });
  const [errors, setErrors] = useState<CheckoutFormErrors>(EMPTY_ERRORS);
  const [touched, setTouched] = useState<CheckoutFormTouched>(EMPTY_TOUCHED);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [apiError, setApiError] = useState<string | null>(null);
  const [clientRequestId, setClientRequestId] = useState<string>('');
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [verifiedOrderNumber, setVerifiedOrderNumber] = useState<string | null>(null);

  // ─── Hydrate draft from localStorage on mount ─────────────────────────
  useEffect(() => {
    const draft = loadCheckoutDraft();
    if (draft) {
      setContact(draft.contact);
      setAddress({ ...EMPTY_ADDRESS, ...draft.address });
    }
    setDraftLoaded(true);
  }, []);

  // ─── Auto-save draft whenever values change (after initial load) ──────
  useEffect(() => {
    if (!draftLoaded) return;
    saveCheckoutDraft({ contact, address });
  }, [contact, address, draftLoaded]);

  // ─── Contact field handlers ──────────────────────────────────────────
  const handleContactChange = useCallback(
    (field: keyof CheckoutContactForm, value: string) => {
      setContact((prev) => ({ ...prev, [field]: value }));
      // Clear error on change if field was touched
      if (touched.contact[field]) {
        setErrors((prev) => ({
          ...prev,
          contact: { ...prev.contact, [field]: undefined },
        }));
      }
    },
    [touched.contact]
  );

  const handleContactBlur = useCallback((field: keyof CheckoutContactForm) => {
    setTouched((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: true },
    }));
    // Validate on blur
    const fieldErrors = validateAll(contact, address);
    setErrors((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: fieldErrors.contact[field] },
    }));
  }, [contact, address]);

  // ─── Address field handlers ──────────────────────────────────────────
  const handleAddressChange = useCallback(
    (field: keyof CheckoutAddressForm, value: string) => {
      setAddress((prev) => ({ ...prev, [field]: value }));
      if (touched.address[field]) {
        setErrors((prev) => ({
          ...prev,
          address: { ...prev.address, [field]: undefined },
        }));
      }
    },
    [touched.address]
  );

  const handleAddressBlur = useCallback((field: keyof CheckoutAddressForm) => {
    setTouched((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: true },
    }));
    const fieldErrors = validateAll(contact, address);
    setErrors((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: fieldErrors.address[field] },
    }));
  }, [contact, address]);

  // ─── Continue to Payment handler ─────────────────────────────────────
  const handleContinue = useCallback(async () => {
    // Mark all fields as touched to reveal all errors
    const allTouched: CheckoutFormTouched = {
      contact: {
        fullName: true,
        mobile: true,
        email: true,
      },
      address: {
        addressLine1: true,
        city: true,
        state: true,
        pin: true,
        country: true,
        addressLine2: true,
        landmark: true,
        deliveryNotes: true,
      },
    };
    setTouched(allTouched);

    const validationErrors = validateAll(contact, address);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      // Scroll to first error field
      const firstErrorKey =
        Object.keys(validationErrors.contact)[0] ||
        Object.keys(validationErrors.address)[0];
      if (firstErrorKey) {
        const el = document.getElementById(`contact-${firstErrorKey}`) ||
                   document.getElementById(`addr-${firstErrorKey}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const reqId = `ds_req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setClientRequestId(reqId);
    
    if (items.length === 0) {
      setApiError("Your checkout is waiting for a piece.");
      setSubmitState('payment_error');
      return;
    }

    const invalidItems = items.some(i => !i.productId || !i.variantId);
    if (invalidItems) {
      setApiError("One item in your cart needs to be refreshed before payment.");
      setSubmitState('payment_error');
      return;
    }

    // All valid — generate payload for Step 10C
    const payload = {
      clientRequestId: reqId,
      contact: {
        fullName: contact.fullName,
        mobile: contact.mobile,
        email: contact.email || '',
      },
      address: {
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        pin: address.pin,
        country: address.country,
        landmark: address.landmark,
        deliveryNotes: address.deliveryNotes,
      },
      items: items.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        tailoringProfile: item.customTailoringSelected && item.tailoringProfile ? {
          bustInches: item.tailoringProfile.measurements?.bust ? parseFloat(item.tailoringProfile.measurements.bust) : undefined,
          waistInches: item.tailoringProfile.measurements?.waist ? parseFloat(item.tailoringProfile.measurements.waist) : undefined,
          hipInches: item.tailoringProfile.measurements?.hips ? parseFloat(item.tailoringProfile.measurements.hips) : undefined,
          shoulderInches: item.tailoringProfile.measurements?.shoulder ? parseFloat(item.tailoringProfile.measurements.shoulder) : undefined,
          heightInches: item.tailoringProfile.measurements?.height ? parseFloat(item.tailoringProfile.measurements.height) : undefined,
          customRequest: item.tailoringProfile.notes,
          // Preserving Step 8A/8B data explicitly
          fitProfile: item.tailoringProfile.fitProfile,
          unit: item.tailoringProfile.unit,
          measurements: item.tailoringProfile.measurements,
          preferences: item.tailoringProfile.preferences,
          notes: item.tailoringProfile.notes,
          confirmedAt: item.tailoringProfile.confirmedAt,
        } : undefined
      }))
    };

    console.log('[Step 10C] Generated Payload for createPaymentOrder:', payload);

    try {
      setSubmitState('creating_order');
      setApiError(null);
      
      const response = await apiClient.createPaymentOrder(payload);
      
      if (!response.success || !response.data) {
        throw new Error(response.error?.code || 'UNKNOWN_ERROR');
      }

      const { data } = response;
      
      if (data.razorpay.keyId.startsWith('rzp_live')) {
        setApiError('Live payment mode is not enabled for this milestone.');
        setSubmitState('payment_error');
        return;
      }

      setSubmitState('loading_razorpay');
      
      const isLoaded = await loadRazorpayScript().catch(() => false);
      if (!isLoaded) {
        throw new Error('SCRIPT_LOAD_ERROR');
      }

      setSubmitState('checkout_opened');
      
      const options: RazorpayOptions = {
        key: data.razorpay.keyId,
        amount: data.razorpay.amount,
        currency: data.razorpay.currency,
        name: 'Do Sakhi',
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpay.orderId,
        prefill: {
          name: contact.fullName,
          email: contact.email || undefined,
          contact: contact.mobile,
        },
        theme: {
          color: '#073F34' // ds-emerald
        },
        handler: async function(response: RazorpayCheckoutResponse) {
          setSubmitState('verifying_payment');
          try {
            const verifyRes = await apiClient.verifyPayment({
              orderId: data.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.success && verifyRes.data?.verified) {
              setVerifiedOrderNumber(verifyRes.data.orderNumber);
              setSubmitState('payment_verified');
            } else {
              setSubmitState('payment_verification_failed');
            }
          } catch (err: any) {
            console.error('[Step 10D] Verification Error:', err);
            setSubmitState('payment_verification_failed');
          }
        },
        modal: {
          ondismiss: function() {
            setSubmitState('payment_cancelled');
          }
        }
      };

      const rzp = new window.Razorpay!(options);
      rzp.open();
      
    } catch (err: any) {
      console.error("[Step 10C] Payment Order Error:", err);
      let safeMsg = 'We could not prepare the payment securely. Please try again.';
      const code = err.message || '';
      
      if (code === 'VALIDATION_ERROR') safeMsg = 'Please review your checkout details once.';
      else if (code === 'EMPTY_CART') safeMsg = 'Your checkout is waiting for a piece.';
      else if (code === 'PRODUCT_NOT_FOUND') safeMsg = 'One item in your cart is no longer available.';
      else if (code === 'VARIANT_NOT_FOUND') safeMsg = 'One selected size is no longer available.';
      else if (code === 'STOCK_UNAVAILABLE') safeMsg = 'This piece is no longer available in the selected size.';
      else if (code === 'PAYMENTS_DISABLED') safeMsg = 'Payments are not enabled in this environment yet.';
      else if (code === 'PAYMENTS_NOT_CONFIGURED') safeMsg = 'Razorpay test keys are not configured yet.';
      else if (code === 'RAZORPAY_ORDER_FAILED') safeMsg = 'We could not prepare the payment securely. Please try again.';
      else if (code === 'NETWORK_ERROR' || code === 'SCRIPT_LOAD_ERROR' || code.includes('Failed to fetch')) safeMsg = 'We could not connect securely. Please check your connection and try again.';
      
      setApiError(safeMsg);
      setSubmitState('payment_error');
    }
  }, [contact, address, items]);

  const handleBackToCart = useCallback(() => {
    toggleCart(true);
  }, [toggleCart]);

  // ─── Wait for hydration ──────────────────────────────────────────────
  if (!isHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="font-sans text-[13px] text-ds-muted-text animate-pulse">
          Loading your cart…
        </span>
      </div>
    );
  }

  // ─── Empty cart state ─────────────────────────────────────────────────
  if (items.length === 0) {
    return <CheckoutEmptyState />;
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8 lg:py-16">
      {/* Desktop: two-column — Mobile: single column */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px]">

        {/* ── LEFT COLUMN: Header + Forms ────────────────────────── */}
        <div className="min-w-0">
          <CheckoutHeader onBackToCart={handleBackToCart} />

          {/* Mobile-only: compact order summary preview */}
          <div className="mb-10 rounded-sm bg-ds-ivory p-5 lg:hidden">
            <div className="flex items-center justify-between">
              <span className="ds-label text-[10px] text-ds-muted-text" style={{ letterSpacing: '0.16em' }}>
                YOUR ORDER
              </span>
              <span className="font-sans text-[13px] text-ds-charcoal">
                {items.length} {items.length === 1 ? 'piece' : 'pieces'}
              </span>
            </div>
            <div className="ds-copper-line mt-2" />
          </div>

          {/* Forms */}
          <div className="flex flex-col gap-12">
            <ContactDetailsForm
              values={contact}
              errors={errors.contact}
              touched={touched.contact}
              onChange={handleContactChange}
              onBlur={handleContactBlur}
            />

            <ShippingAddressForm
              values={address}
              errors={errors.address}
              touched={touched.address}
              onChange={handleAddressChange}
              onBlur={handleAddressBlur}
            />

            <CheckoutTrustNote />
          </div>

          {/* Mobile CTA */}
          <div className="mt-10 lg:hidden">
            {submitState === 'payment_cancelled' && (
              <p className="mb-4 text-center font-sans text-[12px] text-ds-muted-text">
                Payment was not completed. Your checkout details are still safe.
              </p>
            )}
            {submitState === 'payment_error' && apiError && (
              <p className="mb-4 text-center font-sans text-[12px] text-red-500">
                {apiError}
              </p>
            )}
            <button
              type="button"
              onClick={handleContinue}
              disabled={['validating', 'creating_order', 'loading_razorpay', 'checkout_opened', 'verifying_payment'].includes(submitState)}
              className="w-full bg-ds-emerald py-4 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ds-ivory transition-all duration-300 hover:bg-ds-deep-forest disabled:opacity-60"
            >
              {submitState === 'creating_order' ? 'Preparing secure payment...' : 
               submitState === 'loading_razorpay' ? 'Opening Razorpay...' :
               submitState === 'checkout_opened' ? 'Payment in progress...' :
               submitState === 'verifying_payment' ? 'Verifying...' :
               'Continue to Payment'}
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Sticky Order Summary ─────────────────── */}
        <div className="hidden lg:block">
          <div className="sticky top-[100px] rounded-sm bg-ds-ivory p-6">
            {submitState === 'payment_cancelled' && (
              <p className="mb-4 text-center font-sans text-[12px] text-ds-muted-text">
                Payment was not completed. Your checkout details are still safe.
              </p>
            )}
            {submitState === 'payment_error' && apiError && (
              <p className="mb-4 text-center font-sans text-[12px] text-red-500">
                {apiError}
              </p>
            )}
            <CheckoutOrderSummary
              items={items}
              onContinue={handleContinue}
              isSubmitting={['validating', 'creating_order', 'loading_razorpay', 'checkout_opened', 'verifying_payment'].includes(submitState)}
              submitText={
                submitState === 'creating_order' ? 'Preparing secure payment...' : 
                submitState === 'loading_razorpay' ? 'Opening Razorpay...' :
                submitState === 'checkout_opened' ? 'Payment in progress...' :
                submitState === 'verifying_payment' ? 'Verifying...' :
                undefined
              }
            />
          </div>
        </div>
      </div>

      {/* Mobile: Full order summary below forms */}
      <div className="mt-12 rounded-sm bg-ds-ivory p-5 lg:hidden">
        <CheckoutOrderSummary
          items={items}
          onContinue={handleContinue}
          isSubmitting={['validating', 'creating_order', 'loading_razorpay', 'checkout_opened', 'verifying_payment'].includes(submitState)}
          submitText={
            submitState === 'creating_order' ? 'Preparing secure payment...' : 
            submitState === 'loading_razorpay' ? 'Opening Razorpay...' :
            submitState === 'checkout_opened' ? 'Payment in progress...' :
            submitState === 'verifying_payment' ? 'Verifying...' :
            undefined
          }
        />
      </div>

      {/* ── PAYMENT VERIFYING MODAL ─────────────────────────────── */}
      {submitState === 'verifying_payment' && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ds-charcoal/50 backdrop-blur-sm px-5"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-sm bg-ds-warm-white p-8 shadow-2xl">
            <h2
              className="text-center font-serif font-light text-ds-charcoal mb-3"
              style={{ fontSize: 'clamp(20px, 3vw, 28px)', lineHeight: 1.1 }}
            >
              Verifying your payment securely...
            </h2>
            <p className="text-center font-sans text-[14px] leading-relaxed text-ds-charcoal/80 mb-2">
              Please wait while we confirm your payment with the secure server.
            </p>
          </div>
        </div>
      )}

      {/* ── PAYMENT VERIFIED MODAL ─────────────────────────────── */}
      {submitState === 'payment_verified' && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ds-charcoal/50 backdrop-blur-sm px-5"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-sm bg-ds-warm-white p-8 shadow-2xl text-center">
            <div className="mb-5 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ds-soft-sage">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="9" stroke="var(--ds-emerald)" strokeWidth="1.4" />
                  <path
                    d="M7 11l3 3 5-5"
                    stroke="var(--ds-emerald)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <h2
              className="font-serif font-light text-ds-charcoal mb-3"
              style={{ fontSize: 'clamp(20px, 3vw, 28px)', lineHeight: 1.1 }}
            >
              Payment verified securely.
            </h2>
            <p className="font-sans text-[14px] leading-relaxed text-ds-charcoal/80 mb-2">
              Your order has been received by Do Sakhi.
            </p>
            {verifiedOrderNumber && (
              <p className="font-sans text-[13px] leading-relaxed text-ds-charcoal/80 mt-2">
                Order Number: <strong>{verifiedOrderNumber}</strong>
              </p>
            )}
            <div className="ds-copper-line my-6" />
            <button
              type="button"
              onClick={() => {
                // In Step 10E we may clear cart and redirect. For now, just dismiss.
                setSubmitState('idle');
              }}
              className="w-full border border-ds-emerald py-3 font-sans text-[11px] uppercase tracking-[0.15em] text-ds-emerald transition-colors duration-200 hover:bg-ds-emerald hover:text-ds-ivory"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── PAYMENT VERIFICATION FAILED MODAL ─────────────────────────────── */}
      {submitState === 'payment_verification_failed' && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ds-charcoal/50 backdrop-blur-sm px-5"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-sm bg-ds-warm-white p-8 shadow-2xl text-center">
             <h2
              className="font-serif font-light text-ds-charcoal mb-3"
              style={{ fontSize: 'clamp(20px, 3vw, 28px)', lineHeight: 1.1 }}
            >
              We could not verify the payment securely.
            </h2>
            <p className="font-sans text-[14px] leading-relaxed text-ds-charcoal/80 mb-2">
              Please contact Do Sakhi before retrying. Your checkout details are still safe.
            </p>
            <div className="ds-copper-line my-6" />
            <button
              type="button"
              onClick={() => setSubmitState('idle')}
              className="w-full border border-ds-emerald py-3 font-sans text-[11px] uppercase tracking-[0.15em] text-ds-emerald transition-colors duration-200 hover:bg-ds-emerald hover:text-ds-ivory"
            >
              Return to Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
