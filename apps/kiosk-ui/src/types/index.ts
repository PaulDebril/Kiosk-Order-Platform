export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface ProductOptionGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: ProductOption[];
  maxQuantity?: number; // Pour les multiples (ex: max 3 sauces)
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  calories?: number;
  popular?: boolean;
  ingredients?: string[];
  optionGroups?: ProductOptionGroup[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface SelectedOption {
  groupId: string;
  optionId: string;
  name: string;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: SelectedOption[];
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  orderNumber: string;
  type: OrderType;
}

export type OrderType = 'dine-in' | 'takeout';
