'use client';

import Link from 'next/link';
import { ShopProduct, formatPrice, formatEnum } from './shop-utils';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: ShopProduct;
  index: number;
}

function ProductBadge({ product }: { product: ShopProduct }) {
  if (product.custom_tailoring_available) {
    return (
      <span
        className="ds-label"
        style={{
          backgroundColor: 'rgba(7,63,52,0.9)',
          color: '#DDE7DC',
          padding: '4px 10px',
          letterSpacing: '0.14em',
          fontSize: '9px',
        }}
      >
        CUSTOM FIT
      </span>
    );
  }
  if (product.is_ready_to_ship) {
    return (
      <span
        className="ds-label"
        style={{
          backgroundColor: 'rgba(2,43,36,0.85)',
          color: '#B8C9BC',
          padding: '4px 10px',
          letterSpacing: '0.14em',
          fontSize: '9px',
        }}
      >
        READY TO SHIP
      </span>
    );
  }
  return (
    <span
      className="ds-label"
      style={{
        backgroundColor: 'rgba(167,111,77,0.12)',
        color: '#A76F4D',
        padding: '4px 10px',
        letterSpacing: '0.14em',
        fontSize: '9px',
      }}
    >
      NEW EDIT
    </span>
  );
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const href = product.slug ? `/product/${product.slug}` : '#';
  const displayTitle = product.title || 'Untitled Boutique Piece';
  const displayType = formatEnum(product.product_type || product.silhouette) || 'Boutique piece';
  const displayFabric = formatEnum(product.fabric) || 'Boutique selected fabric';
  const displayColour = formatEnum(product.colour) || 'Colour to be updated';
  const displayPrice = formatPrice(product.price);
  const sizes = product.available_sizes?.filter(Boolean) ?? [];

  return (
    <article className="group ds-hover-lift" aria-label={displayTitle}>
      <Link
        href={href}
        tabIndex={0}
        style={{ display: 'block', outline: 'none' }}
        aria-label={`View ${displayTitle}`}
      >
        {/* ── Image Container 4:5 ratio ── */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '4/5',
            backgroundColor: '#F0EAE0',
          }}
        >
          <ProductImage
            image={product.image}
            hoverImage={product.hover_image}
            title={displayTitle}
            productIndex={index}
          />

          {/* Badge overlay */}
          <div
            className="absolute top-3 left-3 z-10"
            style={{ transition: 'opacity 0.3s' }}
          >
            <ProductBadge product={product} />
          </div>

          {/* Hover overlay — very subtle copper tint */}
          <div
            className="absolute inset-0 z-[5] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(to top, rgba(2,43,36,0.12) 0%, transparent 60%)',
            }}
            aria-hidden="true"
          />
        </div>

        {/* ── Product Info ── */}
        <div
          className="pt-4 pb-3"
          style={{
            borderBottom: '1px solid #E8DED2',
          }}
        >
          {/* Type / Category */}
          <p
            className="ds-label mb-1"
            style={{ color: '#A76F4D', fontSize: '9px', letterSpacing: '0.16em' }}
          >
            {displayType}
          </p>

          {/* Title */}
          <h3
            className="mb-1 font-sans font-medium text-ds-charcoal leading-snug"
            style={{ fontSize: '14px' }}
          >
            {displayTitle}
          </h3>

          {/* Colour & Fabric row */}
          <p
            className="mb-3"
            style={{ fontSize: '12px', color: '#6E675F' }}
          >
            {displayColour}
            {displayFabric && displayFabric !== 'Boutique selected fabric' && (
              <span style={{ color: '#B8C9BC' }}> · {displayFabric}</span>
            )}
          </p>

          {/* Price row */}
          <div className="flex items-center justify-between">
            <span
              className="font-sans font-medium"
              style={{ fontSize: '15px', color: '#1D1D1B' }}
            >
              {displayPrice}
            </span>

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap justify-end" style={{ maxWidth: '60%' }}>
                {sizes.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="ds-label"
                    style={{
                      fontSize: '8px',
                      color: '#6E675F',
                      border: '1px solid #E8DED2',
                      padding: '2px 5px',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {s}
                  </span>
                ))}
                {sizes.length > 4 && (
                  <span style={{ fontSize: '10px', color: '#B8C9BC' }}>+{sizes.length - 4}</span>
                )}
              </div>
            )}
            {sizes.length === 0 && (
              <span style={{ fontSize: '11px', color: '#B8C9BC' }}>Size guidance available</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
