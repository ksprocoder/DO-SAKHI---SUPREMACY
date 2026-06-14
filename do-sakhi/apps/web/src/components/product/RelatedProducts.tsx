'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/shop/ProductCard';
import { ShopProduct, normalizeProduct } from '@/components/shop/shop-utils';

interface RelatedProductsProps {
  currentProductId: string;
  collectionId?: string | null;
  productType?: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:4000/api/v1';

export default function RelatedProducts({ currentProductId, collectionId, productType }: RelatedProductsProps) {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      try {
        // We do a broader fetch and filter client-side to ensure we get enough related products
        // without relying on a dedicated related endpoint which might not exist.
        const params = new URLSearchParams({ limit: '12' });
        
        // If we have a collection or type, try to filter by it
        if (collectionId) params.append('collection', collectionId);
        
        const res = await fetch(`${API_BASE}/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        
        const json = await res.json();
        
        let raw: any[] = [];
        if (Array.isArray(json)) raw = json;
        else if (Array.isArray(json?.data)) raw = json.data;
        else if (json?.products && Array.isArray(json.products)) raw = json.products;

        const normalized = raw.map(normalizeProduct);
        
        // Filter out current product
        let related = normalized.filter(p => p.id !== currentProductId);
        
        // If we filtered by type as a fallback, sort them
        if (productType && !collectionId) {
            const sameType = related.filter(p => p.product_type === productType);
            const others = related.filter(p => p.product_type !== productType);
            related = [...sameType, ...others];
        }

        // Take first 4
        setProducts(related.slice(0, 4));
      } catch (err) {
        console.error('Failed to load related products', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRelated();
  }, [currentProductId, collectionId, productType]);

  if (loading || products.length === 0) return null;

  return (
    <div className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col items-center mb-12 text-center">
          <span className="ds-label text-ds-copper mb-4">Explore More</span>
          <h2 className="font-serif text-3xl md:text-4xl text-ds-emerald">
            More from the Edit
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
