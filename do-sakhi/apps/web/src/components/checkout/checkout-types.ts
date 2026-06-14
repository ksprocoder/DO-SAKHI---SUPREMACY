// ─── Checkout Form Types ──────────────────────────────────────────────────

export interface CheckoutContactForm {
  fullName: string;
  mobile: string;
  email: string;
}

export interface CheckoutAddressForm {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pin: string;
  country: string;
  landmark: string;
  deliveryNotes: string;
}

export interface CheckoutDraft {
  contact: CheckoutContactForm;
  address: CheckoutAddressForm;
}

export interface CheckoutFormErrors {
  contact: Partial<Record<keyof CheckoutContactForm, string>>;
  address: Partial<Record<keyof CheckoutAddressForm, string>>;
}

// ─── Field touch tracking ──────────────────────────────────────────────────

export type TouchedContactFields = Partial<Record<keyof CheckoutContactForm, boolean>>;
export type TouchedAddressFields = Partial<Record<keyof CheckoutAddressForm, boolean>>;

export interface CheckoutFormTouched {
  contact: TouchedContactFields;
  address: TouchedAddressFields;
}
