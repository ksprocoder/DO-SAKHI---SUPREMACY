const assert = require('assert');

const initialState = {
  items: [],
  isOpen: false,
  isHydrated: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload, isHydrated: true };
    case 'TOGGLE_CART':
      return { ...state, isOpen: action.payload !== undefined ? action.payload : !state.isOpen };
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (i) => i.productId === action.payload.productId &&
               i.variantId === action.payload.variantId &&
               !i.customTailoringSelected && !action.payload.customTailoringSelected
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        const existingItem = newItems[existingItemIndex];
        const newQuantity = existingItem.quantity + action.payload.quantity;
        const max = existingItem.maxQuantity;
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: max !== undefined ? Math.min(newQuantity, max) : newQuantity
        };
      } else {
        const cartItemId = `${action.payload.variantId}-${Date.now()}`;
        newItems = [...state.items, { ...action.payload, cartItemId }];
      }
      return { ...state, items: newItems, isOpen: true }; 
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(i => i.cartItemId !== action.payload.cartItemId);
      return { ...state, items: newItems };
    }
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(i => {
        if (i.cartItemId === action.payload.cartItemId) {
          return { ...i, quantity: action.payload.quantity };
        }
        return i;
      });
      return { ...state, items: newItems };
    }
    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
}

let state = initialState;
state = cartReducer(state, { type: 'HYDRATE', payload: [] });
state = cartReducer(state, {
  type: 'ADD_ITEM',
  payload: {
    productId: '1',
    variantId: 'v1',
    slug: 'slug',
    title: 'title',
    priceInr: 100,
    quantity: 1,
    customTailoringAvailable: false,
    customTailoringSelected: false,
  }
});

console.log("State after ADD_ITEM:", JSON.stringify(state, null, 2));

if (state.items.length !== 1) {
  console.error("BUG: Item not added!");
  process.exit(1);
} else {
  console.log("SUCCESS: Item added.");
}
