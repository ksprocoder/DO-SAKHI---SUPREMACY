import {
  CheckoutContactForm,
  CheckoutAddressForm,
  CheckoutDraft,
  CheckoutFormErrors,
} from './checkout-types';
import { TailoringMeasurements, FitProfileType } from '../tailoring/tailoring-types';

// ─── localStorage ─────────────────────────────────────────────────────────

export const CHECKOUT_DRAFT_KEY = 'do-sakhi-checkout-draft';

export const EMPTY_CONTACT: CheckoutContactForm = {
  fullName: '',
  mobile: '',
  email: '',
};

export const EMPTY_ADDRESS: CheckoutAddressForm = {
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pin: '',
  country: 'India',
  landmark: '',
  deliveryNotes: '',
};

export function loadCheckoutDraft(): CheckoutDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CheckoutDraft>;
    return {
      contact: { ...EMPTY_CONTACT, ...(parsed.contact || {}) },
      address: { ...EMPTY_ADDRESS, ...(parsed.address || {}) },
    };
  } catch {
    return null;
  }
}

export function saveCheckoutDraft(draft: CheckoutDraft): void {
  if (typeof window === 'undefined') return;
  try {
    // NEVER persist payment data — only contact + address + notes
    const safe: CheckoutDraft = {
      contact: {
        fullName: draft.contact.fullName,
        mobile: draft.contact.mobile,
        email: draft.contact.email,
      },
      address: {
        addressLine1: draft.address.addressLine1,
        addressLine2: draft.address.addressLine2,
        city: draft.address.city,
        state: draft.address.state,
        pin: draft.address.pin,
        country: draft.address.country || 'India',
        landmark: draft.address.landmark,
        deliveryNotes: draft.address.deliveryNotes,
      },
    };
    localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(safe));
  } catch {
    // silently fail — do not block user
  }
}

// ─── Validation ────────────────────────────────────────────────────────────

/**
 * India-aware mobile normalisation.
 * Strips spaces, dashes, leading +91 prefix, then validates 10 digits.
 */
function normaliseMobile(raw: string): string {
  return raw.replace(/[\s\-]/g, '').replace(/^\+91/, '').replace(/^91(?=\d{10}$)/, '');
}

export function validateContact(
  contact: CheckoutContactForm
): Partial<Record<keyof CheckoutContactForm, string>> {
  const errors: Partial<Record<keyof CheckoutContactForm, string>> = {};

  if (!contact.fullName.trim()) {
    errors.fullName = 'Please enter your full name.';
  }

  const normMobile = normaliseMobile(contact.mobile);
  if (!normMobile) {
    errors.mobile = 'Please enter a valid mobile number.';
  } else if (!/^\d{10}$/.test(normMobile)) {
    errors.mobile = 'Please enter a valid 10-digit mobile number.';
  }

  if (contact.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
    errors.email = 'This email does not look complete.';
  }

  return errors;
}

export function validateAddress(
  address: CheckoutAddressForm
): Partial<Record<keyof CheckoutAddressForm, string>> {
  const errors: Partial<Record<keyof CheckoutAddressForm, string>> = {};

  if (!address.addressLine1.trim()) {
    errors.addressLine1 = 'Please enter your address.';
  }
  if (!address.city.trim()) {
    errors.city = 'Please enter your city.';
  }
  if (!address.state.trim()) {
    errors.state = 'Please select your state.';
  }
  if (!address.pin.trim()) {
    errors.pin = 'Please enter your PIN code.';
  } else if (!/^\d{6}$/.test(address.pin.trim())) {
    errors.pin = 'PIN code must be 6 digits.';
  }

  return errors;
}

export function validateAll(
  contact: CheckoutContactForm,
  address: CheckoutAddressForm
): CheckoutFormErrors {
  return {
    contact: validateContact(contact),
    address: validateAddress(address),
  };
}

export function hasErrors(errors: CheckoutFormErrors): boolean {
  return (
    Object.keys(errors.contact).length > 0 || Object.keys(errors.address).length > 0
  );
}

// ─── Price formatting ──────────────────────────────────────────────────────

export function formatINR(amount: number | string | undefined | null): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (num === undefined || num === null || isNaN(num as number)) return '₹—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num as number);
}

// ─── Tailoring helpers ─────────────────────────────────────────────────────

export function countMeasurements(measurements: TailoringMeasurements): number {
  if (!measurements) return 0;
  return Object.values(measurements).filter(
    (v) => v !== undefined && v !== null && String(v).trim() !== ''
  ).length;
}

export function getFitProfileLabel(profile: FitProfileType): string {
  const labels: Record<FitProfileType, string> = {
    standard_adjustment: 'Standard Adjustment',
    custom_measurements: 'Custom Measurements',
    stylist_guidance: 'Stylist Guidance',
  };
  return labels[profile] || profile;
}

export function measurementLabel(key: string): string {
  const labels: Record<string, string> = {
    bust: 'Bust',
    waist: 'Waist',
    hips: 'Hips',
    shoulder: 'Shoulder',
    sleeveLength: 'Sleeve Length',
    armhole: 'Armhole',
    upperArm: 'Upper Arm',
    kurtiLength: 'Kurti Length',
    bottomWaist: 'Bottom Waist',
    bottomLength: 'Bottom Length',
    inseam: 'Inseam',
    height: 'Height',
  };
  return labels[key] || key;
}

export function preferenceLabel(key: string): string {
  const labels: Record<string, string> = {
    fitEase: 'Fit Ease',
    lengthPreference: 'Length',
    sleevePreference: 'Sleeve',
    necklinePreference: 'Neckline',
    bottomPreference: 'Bottom',
  };
  return labels[key] || key;
}

// ─── Image safety ──────────────────────────────────────────────────────────

export function isSafeImageUrl(url?: string | null): boolean {
  if (!url || url.trim() === '') return false;
  if (url.includes('cdn.dosakhi.local')) return false;
  if (url.startsWith('/') || url.startsWith('http')) return true;
  return false;
}
