'use client';

import { useState } from 'react';
import { ProductDetail } from '@/lib/types';
import { safeField } from './product-utils';

interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionItem({ title, isOpen, onToggle, children }: AccordionItemProps) {
  return (
    <div className="border-b border-ds-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-5 flex justify-between items-center group outline-none"
        aria-expanded={isOpen}
      >
        <span className="font-sans text-sm tracking-wide text-ds-charcoal group-hover:text-ds-emerald transition-colors">
          {title}
        </span>
        <span className="text-ds-copper transition-transform duration-300 ease-in-out font-light text-xl relative w-4 h-4 flex items-center justify-center">
          <span className="absolute w-[10px] h-[1px] bg-ds-copper transition-transform duration-300"></span>
          <span className={`absolute w-[1px] h-[10px] bg-ds-copper transition-transform duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}></span>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="ds-body text-ds-muted-text text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsAccordion({ product }: { product: ProductDetail }) {
  const [openSection, setOpenSection] = useState<string | null>('fabric');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const fabricFallback = 'Boutique selected fabric with a comfortable fall.';
  const careFallback = 'Gentle hand wash recommended. Wash dark colours separately. Dry in shade.';
  
  const hasFitDetails = product.fit_note || product.silhouette || product.neckline || product.sleeve_type || product.kurti_length || product.bottom_type;
  const hasDetails = product.embroidery_detail || product.print_detail || product.pocket_available !== undefined;

  return (
    <div className="mt-12 border-t border-ds-border pt-4">
      <AccordionItem
        title="Fabric & Feel"
        isOpen={openSection === 'fabric'}
        onToggle={() => toggleSection('fabric')}
      >
        <div className="flex flex-col gap-2">
          <p>{safeField(product, 'fabric_feel', fabricFallback)}</p>
          {(product.fabric_composition || safeField(product, 'fabric_type', '')) && (
            <ul className="mt-2 list-disc list-inside">
              {safeField(product, 'fabric_type', '') && <li>Fabric: {safeField(product, 'fabric_type', '')}</li>}
              {product.fabric_composition && <li>Composition: {product.fabric_composition}</li>}
            </ul>
          )}
        </div>
      </AccordionItem>

      {hasFitDetails && (
        <AccordionItem
          title="Fit & Silhouette"
          isOpen={openSection === 'fit'}
          onToggle={() => toggleSection('fit')}
        >
          <div className="flex flex-col gap-2">
            {product.fit_note && <p className="mb-2">{product.fit_note}</p>}
            <ul className="list-disc list-inside space-y-1">
              {product.silhouette && <li>Silhouette: {product.silhouette}</li>}
              {product.neckline && <li>Neckline: {product.neckline}</li>}
              {product.sleeve_type && <li>Sleeves: {product.sleeve_type}</li>}
              {product.kurti_length && <li>Kurti Length: {product.kurti_length}</li>}
              {product.bottom_type && <li>Bottoms: {product.bottom_type}</li>}
              {product.dupatta_included !== undefined && <li>Dupatta: {product.dupatta_included ? 'Included' : 'Not Included'}</li>}
            </ul>
          </div>
        </AccordionItem>
      )}

      {hasDetails && (
        <AccordionItem
          title="Details"
          isOpen={openSection === 'details'}
          onToggle={() => toggleSection('details')}
        >
          <ul className="list-disc list-inside space-y-1">
            {product.embroidery_detail && <li>Embroidery: {product.embroidery_detail}</li>}
            {product.print_detail && <li>Print: {product.print_detail}</li>}
            {product.pocket_available !== undefined && <li>Pockets: {product.pocket_available ? 'Yes' : 'No'}</li>}
            {product.ribbon_label && <li>Collection Label: {product.ribbon_label}</li>}
          </ul>
        </AccordionItem>
      )}

      <AccordionItem
        title="Care Guide"
        isOpen={openSection === 'care'}
        onToggle={() => toggleSection('care')}
      >
        <p>{safeField(product, 'care_instructions', careFallback)}</p>
      </AccordionItem>

      <AccordionItem
        title="Shipping & Returns"
        isOpen={openSection === 'shipping'}
        onToggle={() => toggleSection('shipping')}
      >
        <p>
          Dispatch timelines depend on availability and finishing requirements. Ready-to-ship pieces are usually prepared within the stated lead time. Final policies can be refined before launch.
        </p>
      </AccordionItem>
    </div>
  );
}
