import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { CartItem, OrderType, Product, SelectedOption } from '../types';

interface CartState {
  items: CartItem[];
  orderType: OrderType | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; options?: SelectedOption[] } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number; options?: SelectedOption[] } } // On identifie l'article par son ID
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ORDER_TYPE'; payload: OrderType };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity?: number, options?: SelectedOption[]) => void;
  removeItem: (productId: string) => void; // Attention : supprime toutes les variantes du produit
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Petite fonction pour comparer si deux listes d'options sont identiques
const areOptionsEqual = (opts1?: SelectedOption[], opts2?: SelectedOption[]) => {
  if (!opts1 && !opts2) return true;
  if (!opts1 || !opts2) return false;
  if (opts1.length !== opts2.length) return false;

  // On trie pour être sûr que l'ordre des clics ne change pas le résultat
  const s1 = [...opts1].sort((a, b) => a.optionId.localeCompare(b.optionId));
  const s2 = [...opts2].sort((a, b) => a.optionId.localeCompare(b.optionId));

  return s1.every((opt, i) => opt.optionId === s2[i].optionId);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, options } = action.payload;

      // On vérifie si on a déjà exactement le même produit avec les mêmes options
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && areOptionsEqual(item.selectedOptions, options)
      );

      if (existingItemIndex > -1) {
        // Si oui, on augmente juste la quantité
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += quantity;
        return { ...state, items: newItems };
      }

      // Sinon, on ajoute une nouvelle ligne au panier
      return {
        ...state,
        items: [...state.items, { product, quantity, selectedOptions: options }],
      };
    }

    case 'REMOVE_ITEM':
      // Pour l'instant on fait simple : on vire tout ce qui a cet ID
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload),
      };

    case 'UPDATE_QUANTITY': {
      // Idem, on met à jour la quantité pour cet ID (on pourrait affiner par options plus tard)
      const newItems = state.items.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      // On filtre pour virer les articles si la quantité tombe à 0
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

  // Calcule le prix total du panier (produits + options)
  const getTotal = () => {
    return state.items.reduce((total, item) => {
      const productPrice = item.product.price;
      const optionsPrice = item.selectedOptions?.reduce((sum, opt) => sum + opt.price, 0) || 0;
      return total + (productPrice + optionsPrice) * item.quantity;
    }, 0);
  };

  // Compte le nombre total d'articles
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

// Petit hook maison pour utiliser le panier facilement
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart doit être utilisé à l\'intérieur d\'un CartProvider');
  }
  return context;
};

