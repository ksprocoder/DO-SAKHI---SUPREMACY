'use client';

export interface TailoringStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function TailoringStepIndicator({ currentStep, totalSteps }: TailoringStepIndicatorProps) {
  const steps = [
    'Fit Profile',
    'Measurements',
    'Preferences',
    'Review'
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="ds-label text-ds-copper text-[10px]">STEP {currentStep} OF {totalSteps}</span>
        <span className="ds-label text-ds-muted-text text-[10px] uppercase tracking-widest">{steps[currentStep - 1]}</span>
      </div>
      <div className="flex gap-1 w-full h-[2px]">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={`flex-1 transition-colors duration-300 ${
              index + 1 <= currentStep ? 'bg-ds-copper' : 'bg-ds-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
