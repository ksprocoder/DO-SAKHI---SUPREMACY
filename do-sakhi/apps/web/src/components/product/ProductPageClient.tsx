'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { ProductDetail } from '@/lib/types';
import { ProductLoadingSkeleton, ProductErrorState, ProductNotFoundState } from './ProductStates';
import ProductGallery from './ProductGallery';
import ProductInfoPanel from './ProductInfoPanel';
import ProductStory from './ProductStory';
import CustomFitTeaser from './CustomFitTeaser';
import RelatedProducts from './RelatedProducts';

export default function ProductPageClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError(false);
        setNotFound(false);
        
        const data = await apiClient.getProductBySlug(slug);
        
        if (!data || !data.id) {
          setNotFound(true);
        } else {
          setProduct(data);
        }
      } catch (err: any) {
        console.error('Failed to load product:', err);
        if (err.message?.includes('404') || err.message?.toLowerCase().includes('not found')) {
          setNotFound(true);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (loading) return <ProductLoadingSkeleton />;
  if (notFound) return <ProductNotFoundState />;
  if (error || !product) return <ProductErrorState />;

  return (
    <div className="bg-ds-warm-white min-h-screen">
      {/* ── Breadcrumb ── */}
      <div className="mx-auto max-w-7xl px-5 md:px-10 pt-6 pb-4">
        <nav className="flex text-xs font-sans text-ds-muted-text tracking-wide" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-ds-charcoal transition-colors">Home</Link>
            </li>
            <li>
              <span className="text-ds-border mx-1">/</span>
            </li>
            <li>
              <Link href="/shop" className="hover:text-ds-charcoal transition-colors">Shop</Link>
            </li>
            {product.collection_title && product.collection_title !== 'undefined' && (
              <>
                <li>
                  <span className="text-ds-border mx-1">/</span>
                </li>
                <li>
                  <Link href={`/shop?collection=${product.collection_id}`} className="hover:text-ds-charcoal transition-colors">
                    {product.collection_title}
                  </Link>
                </li>
              </>
            )}
            <li>
              <span className="text-ds-border mx-1">/</span>
            </li>
            <li className="text-ds-charcoal font-medium" aria-current="page">
              {product.title}
            </li>
          </ol>
        </nav>
      </div>

      {/* ── Main Viewport ── */}
      <div className="mx-auto max-w-7xl px-5 md:px-10 pb-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Gallery (Left/Top) */}
          <div className="w-full lg:w-3/5 xl:w-[62%]">
            <ProductGallery media={product.media || []} title={product.title} />
          </div>

          {/* Info Panel (Right/Bottom) */}
          <div className="w-full lg:w-2/5 xl:w-[38%]">
            <ProductInfoPanel product={product} />
          </div>

        </div>
      </div>

      {/* ── Custom Fit Teaser ── */}
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <CustomFitTeaser available={product.custom_tailoring_available} />
      </div>

      {/* ── Product Story ── */}
      <ProductStory product={product} />

      {/* ── Related Products ── */}
      <RelatedProducts 
        currentProductId={product.id} 
        collectionId={product.collection_id} 
        productType={(product as any).product_type} 
      />
      
      {/* ── Footer Transition ── */}
      <div className="h-px bg-ds-copper-line w-full"></div>
    </div>
  );
}
