'use client';

import Image from 'next/image';
import { useState } from 'react';
import { isValidImageUrl, getFallbackImage } from './shop-utils';

interface ProductFallbackFrameProps {
  title: string;
  className?: string;
}

function ProductFallbackFrame({ title, className = '' }: ProductFallbackFrameProps) {
  return (
    <div
      className={`ds-product-fallback flex flex-col items-center justify-center gap-3 ${className}`}
      aria-label="Image coming soon"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(167,111,77,0.12) 0%, transparent 70%)',
        }}
      />
      <div
        className="relative z-10 text-center px-4"
        style={{ border: '1px solid rgba(167,111,77,0.25)', padding: '24px 20px' }}
      >
        <p
          className="ds-label"
          style={{ color: '#A76F4D', letterSpacing: '0.22em', fontSize: '10px', marginBottom: '8px' }}
        >
          Do Sakhi
        </p>
        <p
          className="ds-label"
          style={{ color: '#6E675F', letterSpacing: '0.12em', fontSize: '9px' }}
        >
          Image coming soon
        </p>
      </div>
    </div>
  );
}

interface ProductImageProps {
  image: string | null;
  hoverImage: string | null;
  title: string;
  productIndex: number;
}

export function ProductImage({ image, hoverImage, title, productIndex }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(
    isValidImageUrl(image) ? image : null
  );
  const [hoverSrc, setHoverSrc] = useState<string | null>(
    isValidImageUrl(hoverImage) ? hoverImage : null
  );

  const fallback = getFallbackImage(productIndex);

  if (!imgSrc) {
    // Use editorial fallback
    const fallbackSrc = fallback;
    return (
      <Image
        src={fallbackSrc}
        alt={title}
        fill
        className="object-cover object-top ds-img-zoom"
        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
        priority={productIndex < 4}
      />
    );
  }

  return (
    <>
      <Image
        src={imgSrc}
        alt={title}
        fill
        className="object-cover object-top ds-img-zoom transition-opacity duration-500 group-hover:opacity-0"
        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
        onError={() => setImgSrc(null)}
        priority={productIndex < 4}
      />
      {hoverSrc && (
        <Image
          src={hoverSrc}
          alt={`${title} - back view`}
          fill
          className="object-cover object-top ds-img-zoom absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          onError={() => setHoverSrc(null)}
        />
      )}
    </>
  );
}
