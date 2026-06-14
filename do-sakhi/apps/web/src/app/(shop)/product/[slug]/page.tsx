import { Metadata } from 'next';
import ProductPageClient from '@/components/product/ProductPageClient';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Do Sakhi | ${resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
    description: 'Explore this premium boutique piece from Do Sakhi.',
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  
  return (
    <main>
      <ProductPageClient slug={resolvedParams.slug} />
    </main>
  );
}
