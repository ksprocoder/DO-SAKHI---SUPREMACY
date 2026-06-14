'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ProductMedia } from '@/lib/types';
import { getSafeMedia, getFallbackImage } from './product-utils';

interface ProductGalleryProps {
  media: ProductMedia[];
  title: string;
}

export default function ProductGallery({ media, title }: ProductGalleryProps) {
  const safeMedia = getSafeMedia(media);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);

  useEffect(() => {
    // Generate a stable fallback if no valid media exists
    if (safeMedia.length === 0) {
      // Use string length to roughly generate a pseudo-random but stable seed
      const seed = title.length > 0 ? title.charCodeAt(0) + title.length : 0;
      setFallbackSrc(getFallbackImage(seed));
    }
  }, [safeMedia.length, title]);

  // If completely empty and fallback resolved
  if (safeMedia.length === 0) {
    if (!fallbackSrc) return null; // rendering null briefly while fallback resolves
    return (
      <div className="w-full">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5', backgroundColor: '#F0EAE0' }}>
          <Image
            src={fallbackSrc}
            alt={title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </div>
      </div>
    );
  }

  const activeMedia = safeMedia[activeIndex];

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 md:gap-5">
      {/* Thumbnails (Desktop: left side rail, Mobile: bottom strip) */}
      {safeMedia.length > 1 && (
        <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar pb-2 md:pb-0 md:w-20 lg:w-24 flex-shrink-0">
          {safeMedia.map((m, idx) => (
            <button
              key={m.id || idx}
              onClick={() => setActiveIndex(idx)}
              className="relative overflow-hidden flex-shrink-0 transition-all duration-300 outline-none"
              style={{
                aspectRatio: '4/5',
                border: activeIndex === idx ? '1.5px solid #073F34' : '1.5px solid transparent',
                opacity: activeIndex === idx ? 1 : 0.65,
                width: '72px', // fixed width for horizontal mobile scrolling, overriden on desktop
              }}
              aria-label={`View image ${idx + 1}`}
              aria-current={activeIndex === idx}
            >
              <Image
                src={m.url}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                className="object-cover object-top"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="order-1 md:order-2 flex-grow relative overflow-hidden bg-ds-ivory ds-anim-rise" style={{ aspectRatio: '4/5' }}>
        {activeMedia && (
          <Image
            key={activeMedia.url} // Force re-render on src change for clean switch
            src={activeMedia.url}
            alt={`${title} - view ${activeIndex + 1}`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        )}
      </div>
    </div>
  );
}
