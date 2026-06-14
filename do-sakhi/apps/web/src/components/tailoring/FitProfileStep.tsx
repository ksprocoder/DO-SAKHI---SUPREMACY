'use client';

import { FitProfileType, CustomTailoringProfile } from './tailoring-types';

interface FitProfileStepProps {
  draft: CustomTailoringProfile;
  setDraft: (updater: (prev: CustomTailoringProfile) => CustomTailoringProfile) => void;
  onNext: () => void;
}

const OPTIONS: { id: FitProfileType; label: string; desc: string }[] = [
  {
    id: 'standard_adjustment',
    label: 'Standard size adjustment',
    desc: 'I know my selected size, but want to share minor length or fit preferences.',
  },
  {
    id: 'custom_measurements',
    label: 'Custom measurements',
    desc: 'I want to share body measurements for better fit review.',
  },
  {
    id: 'stylist_guidance',
    label: 'Stylist guidance',
    desc: 'I am unsure and want the boutique team to review my notes.',
  },
];

export function FitProfileStep({ draft, setDraft, onNext }: FitProfileStepProps) {
  const handleSelect = (id: FitProfileType) => {
    setDraft(prev => ({ ...prev, fitProfile: id }));
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <h3 className="font-serif text-2xl text-ds-charcoal mb-6">
        How would you like us to guide the fit?
      </h3>
      
      <div className="flex flex-col gap-4 flex-1">
        {OPTIONS.map((opt) => {
          const isSelected = draft.fitProfile === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`text-left p-5 border transition-all duration-300 flex flex-col gap-2 ${
                isSelected 
                  ? 'border-ds-emerald bg-ds-emerald/5' 
                  : 'border-ds-border hover:border-ds-copper hover:bg-ds-warm-white'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`font-sans text-base ${isSelected ? 'text-ds-emerald font-medium' : 'text-ds-charcoal'}`}>
                  {opt.label}
                </span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-ds-emerald' : 'border-ds-border'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-ds-emerald" />}
                </div>
              </div>
              <span className="font-sans text-sm text-ds-muted-text">
                {opt.desc}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pt-8 border-t border-ds-border mt-auto flex gap-4">
        <button 
          onClick={onNext}
          disabled={!draft.fitProfile}
          className="w-full bg-ds-emerald text-ds-ivory py-4 ds-label tracking-widest hover:bg-ds-deep-forest transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
