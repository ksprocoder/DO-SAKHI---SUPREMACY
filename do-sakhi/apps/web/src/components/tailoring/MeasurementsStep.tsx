'use client';

import React from 'react';
import { CustomTailoringProfile, MeasurementUnit, TailoringMeasurements } from './tailoring-types';

interface MeasurementsStepProps {
  draft: CustomTailoringProfile;
  setDraft: (updater: (prev: CustomTailoringProfile) => CustomTailoringProfile) => void;
  onNext: () => void;
  onBack: () => void;
}

const MEASUREMENT_FIELDS: { key: keyof TailoringMeasurements; label: string }[] = [
  { key: 'bust', label: 'Bust' },
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hips' },
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'sleeveLength', label: 'Sleeve Length' },
  { key: 'armhole', label: 'Armhole' },
  { key: 'upperArm', label: 'Upper Arm' },
  { key: 'kurtiLength', label: 'Kurti Length' },
  { key: 'bottomWaist', label: 'Bottom Waist' },
  { key: 'bottomLength', label: 'Bottom Length' },
  { key: 'inseam', label: 'Inseam' },
  { key: 'height', label: 'Height' },
];

export function MeasurementsStep({ draft, setDraft, onNext, onBack }: MeasurementsStepProps) {
  const [warnings, setWarnings] = React.useState<Record<string, boolean>>({});

  const handleUnitToggle = (unit: MeasurementUnit) => {
    setDraft(prev => ({ ...prev, unit }));
    setWarnings({});
  };

  const handleInputChange = (key: keyof TailoringMeasurements, value: string) => {
    let cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimals
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    }

    setDraft(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [key]: cleanValue
      }
    }));
    
    // Clear warning when user types
    if (warnings[key]) {
      setWarnings(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleBlur = (key: keyof TailoringMeasurements, value: string) => {
    if (!value) return;
    
    const num = parseFloat(value);
    if (isNaN(num)) return;

    // Simple range check
    let isUnusual = false;
    if (draft.unit === 'in') {
      if (num < 1 || num > 100) isUnusual = true;
    } else {
      if (num < 2.5 || num > 250) isUnusual = true;
    }

    if (isUnusual) {
      setWarnings(prev => ({ ...prev, [key]: true }));
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="mb-6">
        <h3 className="font-serif text-2xl text-ds-charcoal mb-2">
          Share your measurements
        </h3>
        <p className="font-sans text-sm text-ds-muted-text">
          Add only the measurements you are confident about. You can leave the rest blank and share notes in the next step.
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <div className="flex bg-ds-warm-white p-1 border border-ds-border">
          <button
            onClick={() => handleUnitToggle('in')}
            className={`px-4 py-1 text-xs font-sans uppercase tracking-widest transition-colors ${
              draft.unit === 'in' ? 'bg-ds-charcoal text-ds-ivory' : 'text-ds-muted-text hover:text-ds-charcoal'
            }`}
          >
            Inches
          </button>
          <button
            onClick={() => handleUnitToggle('cm')}
            className={`px-4 py-1 text-xs font-sans uppercase tracking-widest transition-colors ${
              draft.unit === 'cm' ? 'bg-ds-charcoal text-ds-ivory' : 'text-ds-muted-text hover:text-ds-charcoal'
            }`}
          >
            CM
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 flex-1 overflow-y-auto pb-6 pr-2">
        {MEASUREMENT_FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-1">
            <label htmlFor={`measure-${field.key}`} className="font-sans text-xs text-ds-charcoal uppercase tracking-wider">
              {field.label}
            </label>
            <div className="relative">
              <input
                id={`measure-${field.key}`}
                name={`measure-${field.key}`}
                type="text"
                inputMode="decimal"
                value={draft.measurements[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                onBlur={(e) => handleBlur(field.key, e.target.value)}
                placeholder="—"
                className={`w-full border-b bg-transparent py-2 font-sans text-base text-ds-charcoal focus:outline-none transition-colors ${
                  warnings[field.key] ? 'border-amber-500 focus:border-amber-600' : 'border-ds-border focus:border-ds-emerald'
                }`}
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 font-sans text-xs text-ds-muted-text">
                {draft.unit}
              </span>
            </div>
            {warnings[field.key] && (
              <span className="font-sans text-[10px] text-amber-600 leading-tight mt-1 animate-fade-in">
                This value looks unusual. Please check it once.
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-ds-border mt-auto flex gap-4 bg-ds-ivory">
        <button 
          onClick={onBack}
          className="w-1/3 border border-ds-border text-ds-charcoal py-4 ds-label tracking-widest hover:bg-ds-warm-white transition-colors duration-300"
        >
          BACK
        </button>
        <button 
          onClick={onNext}
          className="w-2/3 bg-ds-emerald text-ds-ivory py-4 ds-label tracking-widest hover:bg-ds-deep-forest transition-colors duration-300"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
