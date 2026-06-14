'use client';

import { CheckoutContactForm, CheckoutFormErrors, TouchedContactFields } from './checkout-types';

interface ContactDetailsFormProps {
  values: CheckoutContactForm;
  errors: CheckoutFormErrors['contact'];
  touched: TouchedContactFields;
  onChange: (field: keyof CheckoutContactForm, value: string) => void;
  onBlur: (field: keyof CheckoutContactForm) => void;
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  type?: string;
  inputMode?: 'text' | 'tel' | 'email';
  placeholder?: string;
  autoComplete?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}

function FormField({
  id,
  label,
  value,
  error,
  touched,
  required,
  type = 'text',
  inputMode = 'text',
  placeholder,
  autoComplete,
  onChange,
  onBlur,
}: FieldProps) {
  const showError = touched && !!error;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-sans text-[11px] uppercase tracking-[0.12em] text-ds-charcoal/80"
      >
        {label}
        {required && (
          <span className="ml-1 text-ds-copper/70" aria-hidden="true">*</span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-describedby={showError ? `${id}-error` : undefined}
        aria-invalid={showError ? 'true' : undefined}
        className={`w-full border-b bg-transparent pb-2 pt-1 font-sans text-[15px] text-ds-charcoal placeholder:text-ds-muted-text/50 focus:outline-none transition-colors duration-200 ${
          showError
            ? 'border-ds-error focus:border-ds-error'
            : 'border-ds-border focus:border-ds-emerald'
        }`}
      />
      {showError && (
        <p
          id={`${id}-error`}
          className="font-sans text-[12px] text-ds-error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactDetailsForm({
  values,
  errors,
  touched,
  onChange,
  onBlur,
}: ContactDetailsFormProps) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-6 flex items-center gap-3 w-full">
        <span
          className="font-serif font-light text-ds-charcoal"
          style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
        >
          Contact Details
        </span>
        <div className="flex-1 ds-copper-line-left" />
      </legend>

      <div className="flex flex-col gap-6">
        <FormField
          id="contact-fullName"
          label="Full Name"
          value={values.fullName}
          error={errors.fullName}
          touched={touched.fullName}
          required
          autoComplete="name"
          placeholder="As on government ID"
          onChange={(v) => onChange('fullName', v)}
          onBlur={() => onBlur('fullName')}
        />

        <FormField
          id="contact-mobile"
          label="Mobile Number"
          value={values.mobile}
          error={errors.mobile}
          touched={touched.mobile}
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          onChange={(v) => onChange('mobile', v)}
          onBlur={() => onBlur('mobile')}
        />

        <FormField
          id="contact-email"
          label="Email Address"
          value={values.email}
          error={errors.email}
          touched={touched.email}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Optional — for order updates"
          onChange={(v) => onChange('email', v)}
          onBlur={() => onBlur('email')}
        />
      </div>
    </fieldset>
  );
}
