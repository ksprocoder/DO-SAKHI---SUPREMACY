'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState, useCallback } from 'react';
import { CartItem, CartState, CartAction } from './cart-types';
import { loadCartFromStorage, saveCartToStorage } from './cart-utils';
import { CustomTailoringProfile } from '../tailoring/tailoring-types';

interface CartContextValue extends CartState {
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  toggleCart: (isOpen?: boolean) => void;
  clearCart: () => void;
  updateTailoring: (cartItemId: string, profile: CustomTailoringProfile) => void;
  removeTailoring: (cartItemId: string) => void;
  openTailoring: (cartItemId: string) => void;
  closeTailoring: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const initialState: CartState = {
  items: [],
  isOpen: false,
  isHydrated: false,
  isTailoringOpen: false,
  activeTailoringItemId: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload, isHydrated: true };
    case 'TOGGLE_CART':
      return { ...state, isOpen: action.payload !== undefined ? action.payload : !state.isOpen };
    case 'ADD_ITEM': {
      // Check for duplicate: same productId + variantId + sizeLabel + no custom tailoring
      const existingItemIndex = state.items.findIndex(
        (i) => i.productId === action.payload.productId &&
               i.variantId === action.payload.variantId &&
               i.sizeLabel === action.payload.sizeLabel &&
               !i.customTailoringSelected && !action.payload.customTailoringSelected
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Increase quantity of existing
        newItems = [...state.items];
        const existingItem = newItems[existingItemIndex];
        const newQuantity = existingItem.quantity + action.payload.quantity;
        const max = existingItem.maxQuantity;
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: max !== undefined ? Math.min(newQuantity, max) : newQuantity
        };
      } else {
        // Add as new
        const cartItemId = `${action.payload.variantId}-${Date.now()}`;
        newItems = [...state.items, { ...action.payload, cartItemId }];
      }
      saveCartToStorage(newItems);
      return { ...state, items: newItems, isOpen: true }; // open drawer on add
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(i => i.cartItemId !== action.payload.cartItemId);
      saveCartToStorage(newItems);
      return { ...state, items: newItems };
    }
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(i => {
        if (i.cartItemId === action.payload.cartItemId) {
          return { ...i, quantity: action.payload.quantity };
        }
        return i;
      });
      saveCartToStorage(newItems);
      return { ...state, items: newItems };
    }
    case 'CLEAR_CART': {
      saveCartToStorage([]);
      return { ...state, items: [] };
    }
    case 'UPDATE_TAILORING': {
      const newItems = state.items.map(i => {
        if (i.cartItemId === action.payload.cartItemId) {
          return { ...i, tailoringProfile: action.payload.profile, customTailoringSelected: true };
        }
        return i;
      });
      saveCartToStorage(newItems);
      return { ...state, items: newItems };
    }
    case 'REMOVE_TAILORING': {
      const newItems = state.items.map(i => {
        if (i.cartItemId === action.payload.cartItemId) {
          const { tailoringProfile, ...rest } = i;
          return { ...rest, customTailoringSelected: false };
        }
        return i;
      });
      saveCartToStorage(newItems);
      return { ...state, items: newItems };
    }
    case 'OPEN_TAILORING': {
      return { ...state, isTailoringOpen: true, activeTailoringItemId: action.payload.cartItemId };
    }
    case 'CLOSE_TAILORING': {
      return { ...state, isTailoringOpen: false };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    // Hydrate safely on client
    const storedItems = loadCartFromStorage();
    dispatch({ type: 'HYDRATE', payload: storedItems });
  }, []);

  const addItem = useCallback((item: Omit<CartItem, 'cartItemId'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { cartItemId } });
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity > 0) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
    }
  }, []);

  const toggleCart = useCallback((isOpen?: boolean) => {
    dispatch({ type: 'TOGGLE_CART', payload: isOpen });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const updateTailoring = useCallback((cartItemId: string, profile: CustomTailoringProfile) => {
    dispatch({ type: 'UPDATE_TAILORING', payload: { cartItemId, profile } });
  }, []);

  const removeTailoring = useCallback((cartItemId: string) => {
    dispatch({ type: 'REMOVE_TAILORING', payload: { cartItemId } });
  }, []);

  const openTailoring = useCallback((cartItemId: string) => {
    dispatch({ type: 'OPEN_TAILORING', payload: { cartItemId } });
  }, []);

  const closeTailoring = useCallback(() => {
    dispatch({ type: 'CLOSE_TAILORING' });
  }, []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        toggleCart,
        clearCart,
        updateTailoring,
        removeTailoring,
        openTailoring,
        closeTailoring,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
