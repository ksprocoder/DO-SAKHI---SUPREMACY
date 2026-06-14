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

const EMPTY_ERRORS: CheckoutFormErrors = { contact: {}, address: {} };
const EMPTY_TOUCHED: CheckoutFormTouched = { contact: {}, address: {} };

type SubmitState = 'idle' | 'submitting' | 'done';

export function CheckoutPageClient() {
  const { items, isHydrated, toggleCart } = useCart();

  // ─── Form state ─────────────────────────────────────────────────────────
  const [contact, setContact] = useState<CheckoutContactForm>(EMPTY_CONTACT);
  const [address, setAddress] = useState<CheckoutAddressForm>({ ...EMPTY_ADDRESS, country: 'India' });
  const [errors, setErrors] = useState<CheckoutFormErrors>(EMPTY_ERRORS);
  const [touched, setTouched] = useState<CheckoutFormTouched>(EMPTY_TOUCHED);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [draftLoaded, setDraftLoaded] = useState(false);

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
  const handleContinue = useCallback(() => {
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

    // All valid — show placeholder notice
    setSubmitState('submitting');
    setTimeout(() => setSubmitState('done'), 800);
  }, [contact, address]);

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
            <button
              type="button"
              onClick={handleContinue}
              disabled={submitState === 'submitting'}
              className="w-full bg-ds-emerald py-4 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ds-ivory transition-all duration-300 hover:bg-ds-deep-forest disabled:opacity-60"
            >
              {submitState === 'submitting' ? 'Reviewing…' : 'Continue to Payment'}
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Sticky Order Summary ─────────────────── */}
        <div className="hidden lg:block">
          <div className="sticky top-[100px] rounded-sm bg-ds-ivory p-6">
            <CheckoutOrderSummary
              items={items}
              onContinue={handleContinue}
              isSubmitting={submitState === 'submitting'}
            />
          </div>
        </div>
      </div>

      {/* Mobile: Full order summary below forms */}
      <div className="mt-12 rounded-sm bg-ds-ivory p-5 lg:hidden">
        <CheckoutOrderSummary
          items={items}
          onContinue={handleContinue}
          isSubmitting={submitState === 'submitting'}
        />
      </div>

      {/* ── PAYMENT PLACEHOLDER MODAL ─────────────────────────────── */}
      {submitState === 'done' && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ds-charcoal/50 backdrop-blur-sm px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-notice-heading"
        >
          <div className="relative w-full max-w-md rounded-sm bg-ds-warm-white p-8 shadow-2xl">
            {/* Copper top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, var(--ds-copper) 30%, var(--ds-copper) 70%, transparent 100%)',
                opacity: 0.5,
              }}
              aria-hidden="true"
            />

            {/* Icon */}
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
              id="payment-notice-heading"
              className="text-center font-serif font-light text-ds-charcoal mb-3"
              style={{ fontSize: 'clamp(20px, 3vw, 28px)', lineHeight: 1.1 }}
            >
              Details Confirmed
            </h2>

            <p className="text-center font-sans text-[14px] leading-relaxed text-ds-charcoal/80 mb-2">
              Your checkout details are ready.
            </p>
            <p className="text-center font-sans text-[14px] leading-relaxed text-ds-muted-text">
              Payment will be connected in the next milestone.
            </p>

            <div className="ds-copper-line my-6" />

            <p className="text-center font-sans text-[12px] text-ds-muted-text/70 mb-6">
              Your contact and shipping details have been saved securely.
            </p>

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
