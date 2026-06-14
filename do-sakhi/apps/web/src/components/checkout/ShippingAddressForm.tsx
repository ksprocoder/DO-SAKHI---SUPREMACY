'use client';

import { CheckoutAddressForm, CheckoutFormErrors, TouchedAddressFields } from './checkout-types';

// ─── Indian States List ────────────────────────────────────────────────────
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

interface ShippingAddressFormProps {
  values: CheckoutAddressForm;
  errors: CheckoutFormErrors['address'];
  touched: TouchedAddressFields;
  onChange: (field: keyof CheckoutAddressForm, value: string) => void;
  onBlur: (field: keyof CheckoutAddressForm) => void;
}

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  inputMode?: 'text' | 'numeric';
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  onChange: (v: string) => void;
  onBlur: () => void;
}

function InputField({
  id, label, value, error, touched, required,
  inputMode = 'text', placeholder, autoComplete, maxLength,
  onChange, onBlur,
}: InputFieldProps) {
  const showError = touched && !!error;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-sans text-[11px] uppercase tracking-[0.12em] text-ds-charcoal/80"
      >
        {label}
        {required && <span className="ml-1 text-ds-copper/70" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        inputMode={inputMode}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-describedby={showError ? `${id}-error` : undefined}
        aria-invalid={showError ? 'true' : undefined}
        className={`w-full border-b bg-transparent pb-2 pt-1 font-sans text-[15px] text-ds-charcoal placeholder:text-ds-muted-text/50 focus:outline-none transition-colors duration-200 ${
          showError ? 'border-ds-error' : 'border-ds-border focus:border-ds-emerald'
        }`}
      />
      {showError && (
        <p id={`${id}-error`} className="font-sans text-[12px] text-ds-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  error?: string;
  touched?: boolean;
  required?: boolean;
  autoComplete?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}

function SelectField({
  id, label, value, options, error, touched, required, autoComplete,
  onChange, onBlur,
}: SelectFieldProps) {
  const showError = touched && !!error;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-sans text-[11px] uppercase tracking-[0.12em] text-ds-charcoal/80"
      >
        {label}
        {required && <span className="ml-1 text-ds-copper/70" aria-hidden="true">*</span>}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        autoComplete={autoComplete}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-describedby={showError ? `${id}-error` : undefined}
        aria-invalid={showError ? 'true' : undefined}
        className={`w-full border-b bg-transparent pb-2 pt-1 font-sans text-[15px] text-ds-charcoal focus:outline-none transition-colors duration-200 appearance-none cursor-pointer ${
          showError ? 'border-ds-error' : 'border-ds-border focus:border-ds-emerald'
        } ${value === '' ? 'text-ds-muted-text/50' : ''}`}
      >
        <option value="" disabled>Select state</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {showError && (
        <p id={`${id}-error`} className="font-sans text-[12px] text-ds-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextareaFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  onChange: (v: string) => void;
  onBlur: () => void;
}

function TextareaField({ id, label, value, placeholder, maxLength = 300, onChange, onBlur }: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-sans text-[11px] uppercase tracking-[0.12em] text-ds-charcoal/80"
      >
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="w-full resize-none border-b border-ds-border bg-transparent pb-2 pt-1 font-sans text-[15px] text-ds-charcoal placeholder:text-ds-muted-text/50 focus:border-ds-emerald focus:outline-none transition-colors duration-200"
      />
      <p className="self-end font-sans text-[11px] text-ds-muted-text/50">
        {value.length}/{maxLength}
      </p>
    </div>
  );
}

export function ShippingAddressForm({
  values,
  errors,
  touched,
  onChange,
  onBlur,
}: ShippingAddressFormProps) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-6 flex items-center gap-3 w-full">
        <span
          className="font-serif font-light text-ds-charcoal"
          style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
        >
          Shipping Address
        </span>
        <div className="flex-1 ds-copper-line-left" />
      </legend>

      <div className="flex flex-col gap-6">
        <InputField
          id="addr-line1"
          label="Address Line 1"
          value={values.addressLine1}
          error={errors.addressLine1}
          touched={touched.addressLine1}
          required
          autoComplete="address-line1"
          placeholder="House / Flat / Building number and street"
          onChange={(v) => onChange('addressLine1', v)}
          onBlur={() => onBlur('addressLine1')}
        />

        <InputField
          id="addr-line2"
          label="Address Line 2"
          value={values.addressLine2}
          autoComplete="address-line2"
          placeholder="Colony, locality, area (optional)"
          onChange={(v) => onChange('addressLine2', v)}
          onBlur={() => onBlur('addressLine2')}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <InputField
            id="addr-city"
            label="City"
            value={values.city}
            error={errors.city}
            touched={touched.city}
            required
            autoComplete="address-level2"
            placeholder="Mumbai"
            onChange={(v) => onChange('city', v)}
            onBlur={() => onBlur('city')}
          />

          <SelectField
            id="addr-state"
            label="State"
            value={values.state}
            options={INDIAN_STATES}
            error={errors.state}
            touched={touched.state}
            required
            autoComplete="address-level1"
            onChange={(v) => onChange('state', v)}
            onBlur={() => onBlur('state')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <InputField
            id="addr-pin"
            label="PIN Code"
            value={values.pin}
            error={errors.pin}
            touched={touched.pin}
            required
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="6-digit PIN"
            maxLength={6}
            onChange={(v) => onChange('pin', v.replace(/\D/g, '').slice(0, 6))}
            onBlur={() => onBlur('pin')}
          />

          <InputField
            id="addr-country"
            label="Country"
            value={values.country}
            autoComplete="country-name"
            onChange={(v) => onChange('country', v)}
            onBlur={() => onBlur('country')}
          />
        </div>

        <InputField
          id="addr-landmark"
          label="Landmark"
          value={values.landmark}
          autoComplete="off"
          placeholder="Near school, temple, metro station (optional)"
          onChange={(v) => onChange('landmark', v)}
          onBlur={() => onBlur('landmark')}
        />

        <TextareaField
          id="addr-deliveryNotes"
          label="Delivery Notes"
          value={values.deliveryNotes}
          placeholder="Example: Please call before delivery, or leave with security if I am unavailable."
          maxLength={300}
          onChange={(v) => onChange('deliveryNotes', v)}
          onBlur={() => onBlur('deliveryNotes')}
        />
      </div>
    </fieldset>
  );
}
