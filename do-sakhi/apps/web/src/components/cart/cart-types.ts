import { CustomTailoringProfile } from '../tailoring/tailoring-types';

export interface CartItem {
  cartItemId: string; // unique ID for the line item in local state
  productId: string;
  variantId: string;
  slug: string;
  title: string;
  productType?: string;
  image?: string;
  fallbackImage?: string;
  colour?: string;
  sizeLabel?: string;
  sizeNumeric?: number;
  priceInr: number;
  quantity: number;
  maxQuantity?: number;
  customTailoringAvailable: boolean;
  customTailoringSelected: boolean;
  customTailoringSummary?: string | null;
  stockStatus?: string;
  tailoringProfile?: CustomTailoringProfile;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isHydrated: boolean;
  isTailoringOpen: boolean;
  activeTailoringItemId: string | null;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'cartItemId'> }
  | { type: 'REMOVE_ITEM'; payload: { cartItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'TOGGLE_CART'; payload?: boolean }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: CartItem[] }
  | { type: 'UPDATE_TAILORING'; payload: { cartItemId: string; profile: CustomTailoringProfile } }
  | { type: 'REMOVE_TAILORING'; payload: { cartItemId: string } }
  | { type: 'OPEN_TAILORING'; payload: { cartItemId: string } }
  | { type: 'CLOSE_TAILORING' };
