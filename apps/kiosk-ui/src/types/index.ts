export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  calories?: number;
  popular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customizations?: string[];
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  orderNumber: string;
}

export type OrderType = 'dine-in' | 'takeout';
