'use client';

import ProductCard from './ProductCard';
import { ShopProduct } from './shop-utils';

interface ProductGridProps {
  products: ShopProduct[];
}

/** Editorial interlude shown after the first row */
function EditorialInterlude() {
  return (
    <div
      className="col-span-2 md:col-span-3 xl:col-span-4 my-2"
      aria-label="Editorial note"
    >
      <div
        className="relative overflow-hidden py-10 px-8 md:px-12"
        style={{
          background: 'linear-gradient(160deg, #EDE8DF 0%, #DDE7DC 60%, #C8D9C4 100%)',
          borderTop: '1px solid #E8DED2',
          borderBottom: '1px solid #E8DED2',
        }}
      >
        {/* Corner ornament */}
        <div
          className="absolute top-5 right-8 hidden md:block"
          style={{
            width: '32px',
            height: '32px',
            borderTop: '1px solid rgba(167,111,77,0.3)',
            borderRight: '1px solid rgba(167,111,77,0.3)',
          }}
          aria-hidden="true"
        />

        <div className="flex items-start gap-5">
          <div
            className="hidden md:block mt-1 flex-shrink-0"
            style={{
              width: '1px',
              height: '60px',
              background: 'linear-gradient(to bottom, rgba(167,111,77,0.5), transparent)',
            }}
            aria-hidden="true"
          />
          <div>
            <p
              className="ds-label mb-3"
              style={{ color: '#A76F4D', letterSpacing: '0.22em', fontSize: '10px' }}
            >
              The Do Sakhi Edit
            </p>
            <p
              className="font-sans"
              style={{
                color: '#6E675F',
                fontSize: '14px',
                lineHeight: 1.8,
                maxWidth: '480px',
              }}
            >
              Pieces are selected in small batches, with attention to fabric fall,
              graceful colour and everyday elegance. Each piece is boutique-curated —
              never mass-produced.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) return null;

  // Build output rows: insert editorial interlude after first row (3 products)
  const firstRowEnd = Math.min(3, products.length);

  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-3"
      role="list"
      aria-label="Product listing"
    >
      {/* First row */}
      {products.slice(0, firstRowEnd).map((product, i) => (
        <div key={product.id || i} role="listitem">
          <ProductCard product={product} index={i} />
        </div>
      ))}

      {/* Editorial interlude (only if we have more than 3 products) */}
      {products.length > 3 && <EditorialInterlude />}

      {/* Rest of the products */}
      {products.slice(firstRowEnd).map((product, i) => (
        <div key={product.id || (i + firstRowEnd)} role="listitem">
          <ProductCard product={product} index={i + firstRowEnd} />
        </div>
      ))}
    </div>
  );
}
