'use client';

import React from 'react';
import { CustomTailoringProfile, TailoringPreferences } from './tailoring-types';

interface PreferencesStepProps {
  draft: CustomTailoringProfile;
  setDraft: (updater: (prev: CustomTailoringProfile) => CustomTailoringProfile) => void;
  onNext: () => void;
  onBack: () => void;
}

const PREF_OPTIONS = {
  fitEase: ['Comfort', 'Regular', 'Relaxed'],
  lengthPreference: ['As shown', 'Slightly shorter', 'Slightly longer', 'Custom note'],
  sleevePreference: ['As shown', 'Shorter', 'Longer', 'Custom note'],
  necklinePreference: ['As shown', 'Slightly higher', 'Slightly deeper', 'Custom note'],
  bottomPreference: ['As shown', 'More relaxed', 'More tapered', 'Custom note'],
};

export function PreferencesStep({ draft, setDraft, onNext, onBack }: PreferencesStepProps) {
  const handlePrefChange = (key: keyof TailoringPreferences, value: string) => {
    setDraft(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="mb-6">
        <h3 className="font-serif text-2xl text-ds-charcoal mb-2">
          Share your fit preferences
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 pr-2 flex flex-col gap-6">
        
        {Object.entries(PREF_OPTIONS).map(([key, options]) => (
          <div key={key} className="flex flex-col gap-2">
            <label className="font-sans text-xs text-ds-charcoal uppercase tracking-wider">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <div className="relative">
              <select
                value={draft.preferences[key as keyof TailoringPreferences] || ''}
                onChange={(e) => handlePrefChange(key as keyof TailoringPreferences, e.target.value)}
                className="w-full border-b border-ds-border bg-transparent py-2 font-sans text-base text-ds-charcoal focus:outline-none focus:border-ds-emerald transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-ds-muted-text">Select preference</option>
                {options.map(opt => (
                  <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                ))}
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-ds-copper">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-2 mt-2">
          <label className="font-sans text-xs text-ds-charcoal uppercase tracking-wider">
            Additional Notes
          </label>
          <textarea
            value={draft.notes || ''}
            onChange={handleNotesChange}
            placeholder="Example: I prefer a relaxed fit around the waist and slightly longer kurti length."
            maxLength={500}
            rows={4}
            className="w-full border border-ds-border bg-transparent p-3 font-sans text-sm text-ds-charcoal focus:outline-none focus:border-ds-emerald transition-colors resize-none"
          />
        </div>
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
          REVIEW DETAILS
        </button>
      </div>
    </div>
  );
}
