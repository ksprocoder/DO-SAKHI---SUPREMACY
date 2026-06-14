'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useCart } from '../cart/CartProvider';
import { CustomTailoringProfile } from './tailoring-types';
import { TailoringStepIndicator } from './TailoringStepIndicator';
import { FitProfileStep } from './FitProfileStep';
import { MeasurementsStep } from './MeasurementsStep';
import { PreferencesStep } from './PreferencesStep';
import { TailoringReviewStep } from './TailoringReviewStep';

const INITIAL_PROFILE: CustomTailoringProfile = {
  enabled: true,
  fitProfile: 'standard_adjustment',
  unit: 'in',
  measurements: {},
  preferences: {},
  notes: ''
};

export default function TailoringDrawer() {
  const { items, isTailoringOpen, activeTailoringItemId, closeTailoring, updateTailoring } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [draft, setDraft] = useState<CustomTailoringProfile>(INITIAL_PROFILE);
  const [isVisible, setIsVisible] = useState(false);

  const activeItem = useMemo(() => {
    return items.find(i => i.cartItemId === activeTailoringItemId);
  }, [items, activeTailoringItemId]);

  useEffect(() => {
    if (isTailoringOpen && activeItem) {
      setIsVisible(true);
      setCurrentStep(1);
      // Pre-fill if editing
      if (activeItem.tailoringProfile) {
        setDraft(activeItem.tailoringProfile);
      } else {
        setDraft(INITIAL_PROFILE);
      }
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      // Do not clear document overflow here if CartDrawer is still open!
      // CartDrawer manages its own scroll lock. Since Tailoring is above it,
      // it's fine to just let CartDrawer handle it, or restore if CartDrawer is closed.
      // But we can safely do it if we coordinate. CartProvider does not manage scroll.
      // For now, let's just do it, and if it conflicts, CartDrawer's useEffect will re-run on its deps.
      // Actually, safest is to not touch body overflow here, let CartDrawer handle it, 
      // or just coordinate. Since tailoring opens *from* cart, cart is always open.
    }
  }, [isTailoringOpen, activeItem]);

  if (!isTailoringOpen || !activeItem) return null;

  const handleClose = () => {
    closeTailoring();
  };

  const handleSave = () => {
    const finalProfile = { ...draft, confirmedAt: new Date().toISOString() };
    updateTailoring(activeItem.cartItemId, finalProfile);
    closeTailoring();
  };

  const displayImage = activeItem.image && activeItem.image !== 'undefined' ? activeItem.image : null;
  const fallbackImg = activeItem.fallbackImage || '/images/editorial/product-1.jpg';

  return (
    <>
      {/* Overlay - higher z-index than CartDrawer (z-50) */}
      <div 
        className={`fixed inset-0 bg-ds-charcoal/40 backdrop-blur-sm z-[60] transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[480px] lg:w-[520px] bg-ds-ivory shadow-2xl z-[70] transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Custom Fit Guidance"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ds-border">
          <h2 className="font-serif text-2xl text-ds-charcoal tracking-wide">Custom Fit</h2>
          <button 
            onClick={handleClose}
            className="text-ds-muted-text hover:text-ds-charcoal transition-colors p-2 -mr-2"
            aria-label="Close fit guidance"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Product Context */}
        <div className="px-6 py-4 border-b border-ds-border/50 bg-ds-warm-white flex items-center gap-4">
          <div className="relative w-16 h-20 bg-ds-warm-white overflow-hidden flex-shrink-0 border border-ds-border">
            <Image
              src={displayImage || fallbackImg}
              alt={activeItem.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xs text-ds-copper tracking-widest uppercase mb-1">Editing Fit For</span>
            <span className="font-serif text-lg text-ds-charcoal leading-tight">{activeItem.title}</span>
            <span className="font-sans text-xs text-ds-muted-text mt-1">
              Size: {activeItem.sizeLabel || 'Selected Size'} | Colour: {activeItem.colour || 'As Shown'}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">
          <TailoringStepIndicator currentStep={currentStep} totalSteps={4} />

          <div className="flex-1 flex flex-col min-h-0">
            {currentStep === 1 && (
              <FitProfileStep 
                draft={draft} 
                setDraft={setDraft} 
                onNext={() => setCurrentStep(2)} 
              />
            )}
            {currentStep === 2 && (
              <MeasurementsStep 
                draft={draft} 
                setDraft={setDraft} 
                onNext={() => setCurrentStep(3)} 
                onBack={() => setCurrentStep(1)} 
              />
            )}
            {currentStep === 3 && (
              <PreferencesStep 
                draft={draft} 
                setDraft={setDraft} 
                onNext={() => setCurrentStep(4)} 
                onBack={() => setCurrentStep(2)} 
              />
            )}
            {currentStep === 4 && (
              <TailoringReviewStep 
                draft={draft} 
                onSave={handleSave} 
                onBack={() => setCurrentStep(3)} 
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
