"use client";

import { useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  initials: string;
}

export function ProductImage({ src, alt, className, initials }: ProductImageProps) {
  const isFake = src?.includes("cdn.dosakhi.local");
  const [error, setError] = useState(!src || isFake);

  if (error) {
    return (
      <div className="ds-product-fallback relative flex h-full w-full items-center justify-center">
        <div className="relative z-10 flex flex-col items-center gap-2">
          <span
            className="font-serif font-light text-ds-copper/35 select-none"
            style={{ fontSize: "36px" }}
            aria-hidden="true"
          >
            {initials}
          </span>
          <div
            className="h-px w-8"
            style={{ background: "rgba(167,111,77,0.28)" }}
          />
          <span className="ds-label text-ds-muted-text/55">Do Sakhi</span>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
