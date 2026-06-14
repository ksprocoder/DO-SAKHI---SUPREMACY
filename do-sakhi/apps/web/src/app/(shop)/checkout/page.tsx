import type { Metadata } from 'next';
import { CheckoutPageClient } from '@/components/checkout/CheckoutPageClient';

export const metadata: Metadata = {
  title: 'Checkout — Do Sakhi | Quiet Luxury Boutique',
  description: 'Review your order, confirm details, and prepare for payment.',
};

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
