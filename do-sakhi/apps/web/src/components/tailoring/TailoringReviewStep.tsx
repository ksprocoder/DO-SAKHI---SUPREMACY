'use client';

import React from 'react';
import { CustomTailoringProfile, TailoringMeasurements, TailoringPreferences } from './tailoring-types';

interface TailoringReviewStepProps {
  draft: CustomTailoringProfile;
  onSave: () => void;
  onBack: () => void;
}

export function TailoringReviewStep({ draft, onSave, onBack }: TailoringReviewStepProps) {
  const formatKey = (key: string) => key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase());
  
  const measurementsProvided = Object.entries(draft.measurements)
    .filter(([_, val]) => val !== undefined && val !== '')
    .map(([key, val]) => ({ label: formatKey(key), value: `${val} ${draft.unit}` }));

  const preferencesProvided = Object.entries(draft.preferences)
    .filter(([_, val]) => val !== undefined && val !== '')
    .map(([key, val]) => ({ label: formatKey(key), value: val as string }));

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="mb-6">
        <h3 className="font-serif text-2xl text-ds-charcoal mb-2">
          Review your fit details
        </h3>
        <p className="font-sans text-sm text-ds-muted-text">
          Your fit details will be saved with this cart item for boutique review before preparation.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 pr-2 flex flex-col gap-6">
        
        {/* Profile Type */}
        <div className="bg-ds-warm-white p-4 border border-ds-border">
          <p className="font-sans text-xs text-ds-muted-text uppercase tracking-wider mb-1">Fit Profile</p>
          <p className="font-sans text-sm text-ds-charcoal font-medium">
            {formatKey(draft.fitProfile)}
          </p>
        </div>

        {/* Measurements Summary */}
        {measurementsProvided.length > 0 && (
          <div className="bg-ds-warm-white p-4 border border-ds-border">
            <p className="font-sans text-xs text-ds-muted-text uppercase tracking-wider mb-3">Measurements ({measurementsProvided.length})</p>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {measurementsProvided.map(m => (
                <div key={m.label} className="flex justify-between border-b border-ds-border/50 pb-1">
                  <span className="font-sans text-sm text-ds-muted-text">{m.label}</span>
                  <span className="font-sans text-sm text-ds-charcoal font-medium">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Summary */}
        {preferencesProvided.length > 0 && (
          <div className="bg-ds-warm-white p-4 border border-ds-border">
            <p className="font-sans text-xs text-ds-muted-text uppercase tracking-wider mb-3">Preferences</p>
            <div className="flex flex-col gap-2">
              {preferencesProvided.map(p => (
                <div key={p.label} className="flex flex-col border-b border-ds-border/50 pb-2">
                  <span className="font-sans text-xs text-ds-muted-text">{p.label}</span>
                  <span className="font-sans text-sm text-ds-charcoal font-medium capitalize">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Summary */}
        {draft.notes && (
          <div className="bg-ds-warm-white p-4 border border-ds-border">
            <p className="font-sans text-xs text-ds-muted-text uppercase tracking-wider mb-2">Notes</p>
            <p className="font-sans text-sm text-ds-charcoal italic leading-relaxed">"{draft.notes}"</p>
          </div>
        )}

      </div>

      <div className="pt-6 border-t border-ds-border mt-auto flex gap-4 bg-ds-ivory">
        <button 
          onClick={onBack}
          className="w-1/3 border border-ds-border text-ds-charcoal py-4 ds-label tracking-widest hover:bg-ds-warm-white transition-colors duration-300"
        >
          BACK
        </button>
        <button 
          onClick={onSave}
          className="w-2/3 bg-ds-emerald text-ds-ivory py-4 ds-label tracking-widest hover:bg-ds-deep-forest transition-colors duration-300"
        >
          SAVE CUSTOM FIT
        </button>
      </div>
    </div>
  );
}
