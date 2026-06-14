import { ProductDetail } from '@/lib/types';
import { safeField } from './product-utils';

interface ProductStoryProps {
  product: ProductDetail;
}

export default function ProductStory({ product }: ProductStoryProps) {
  const fallbackDesc = 'A curated Do Sakhi piece selected for graceful everyday elegance. Designed with careful attention to fall and comfort.';
  const description = product.description || product.short_description || fallbackDesc;
  const type = safeField(product, 'product_type', 'Boutique edit');
  
  // Format description into paragraphs if it has newlines
  const paragraphs = description.split('\n').filter((p: string) => p.trim() !== '');

  return (
    <div className="py-20 md:py-32 border-t border-ds-border">
      <div className="max-w-3xl mx-auto px-5 text-center">
        <span className="ds-label text-ds-copper mb-6 block">The Edit</span>
        <h2 className="font-serif text-3xl md:text-5xl text-ds-emerald mb-10 leading-tight">
          {product.title}
        </h2>
        
        <div className="flex flex-col gap-6 ds-body text-ds-charcoal mx-auto max-w-2xl leading-relaxed">
          {paragraphs.length > 0 ? (
            paragraphs.map((text: string, i: number) => (
              <p key={i}>{text}</p>
            ))
          ) : (
            <p>{description}</p>
          )}
        </div>
        
        <div className="mt-16 flex justify-center gap-8 border-t border-ds-border pt-12">
          {product.collection_title && (
            <div className="text-center">
              <span className="ds-label text-ds-muted-text block mb-2">Collection</span>
              <span className="font-sans text-sm text-ds-charcoal">{product.collection_title}</span>
            </div>
          )}
          <div className="text-center">
            <span className="ds-label text-ds-muted-text block mb-2">Style</span>
            <span className="font-sans text-sm text-ds-charcoal">{type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
