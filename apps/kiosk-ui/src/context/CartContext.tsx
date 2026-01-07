import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { CartItem, OrderType, Product, SelectedOption } from '../types';

interface CartState {
  items: CartItem[];
  orderType: OrderType | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; options?: SelectedOption[] } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number; options?: SelectedOption[] } } // Need to identify item uniquely
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ORDER_TYPE'; payload: OrderType };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity?: number, options?: SelectedOption[]) => void;
  removeItem: (productId: string) => void; // Warning: naive implementation removes all variations of product
  updateQuantity: (productId: string, quantity: number) => void; // Warning: naive implementation
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to compare options arrays
const areOptionsEqual = (opts1?: SelectedOption[], opts2?: SelectedOption[]) => {
  if (!opts1 && !opts2) return true;
  if (!opts1 || !opts2) return false;
  if (opts1.length !== opts2.length) return false;

  // Sort by strings to ensure order doesn't matter
  const s1 = [...opts1].sort((a, b) => a.optionId.localeCompare(b.optionId));
  const s2 = [...opts2].sort((a, b) => a.optionId.localeCompare(b.optionId));

  return s1.every((opt, i) => opt.optionId === s2[i].optionId);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, options } = action.payload;

      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && areOptionsEqual(item.selectedOptions, options)
      );

      if (existingItemIndex > -1) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += quantity;
        return { ...state, items: newItems };
      }

      return {
        ...state,
        items: [...state.items, { product, quantity, selectedOptions: options }],
      };
    }

    case 'REMOVE_ITEM':
      // Simplified: removes all items with this product ID. 
      // Ideally should remove specific line item, but since UI only passes ID for now...
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload),
      };

    case 'UPDATE_QUANTITY': {
      // Simplified: updates all items with this product ID.
      // In a real app we'd need a unique CartItemId (generated uuid) for each line item.
      const newItems = state.items.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { ...state, items: newItems.filter(item => item.quantity > 0) };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'SET_ORDER_TYPE':
      return { ...state, orderType: action.payload };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    orderType: null,
  });

  const addItem = (product: Product, quantity: number = 1, options?: SelectedOption[]) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, options } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setOrderType = (type: OrderType) => {
    dispatch({ type: 'SET_ORDER_TYPE', payload: type });
  };

  const getTotal = () => {
    return state.items.reduce((total, item) => {
      const productPrice = item.product.price;
      const optionsPrice = item.selectedOptions?.reduce((sum, opt) => sum + opt.price, 0) || 0;
      return total + (productPrice + optionsPrice) * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setOrderType,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
