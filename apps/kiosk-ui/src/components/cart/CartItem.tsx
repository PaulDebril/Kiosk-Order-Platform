import React from 'react';
import { IoRemove, IoAdd, IoClose } from 'react-icons/io5';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface CartItemType {
  product: Product;
  quantity: number;
}

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.product.id, item.quantity - 1);
    } else {
      onRemove(item.product.id);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.product.id, item.quantity + 1);
  };

  return (
    <div className="flex items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <img
        src={item.product.image}
        alt={item.product.name}
        className="w-28 h-28 object-cover rounded-xl shadow-sm"
      />
      <div className="flex-1">
        <h4 className="font-bold text-xl text-gray-900 mb-2">{item.product.name}</h4>
        <p className="text-primary-600 font-black text-2xl">
          {item.product.price.toFixed(2)}€
        </p>
      </div>
      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-2 border border-gray-200">
        <button
          onClick={handleDecrease}
          className="w-10 h-10 rounded-lg bg-white border border-gray-200 active:bg-gray-100 text-gray-700 font-black text-xl transition-all transform active:scale-90 shadow-sm flex items-center justify-center"
        >
          <IoRemove className="w-5 h-5" />
        </button>
        <span className="text-2xl font-black w-10 text-center text-gray-900">{item.quantity}</span>
        <button
          onClick={handleIncrease}
          className="w-10 h-10 rounded-lg bg-white border border-gray-200 active:bg-gray-100 text-gray-700 font-black text-xl transition-all transform active:scale-90 shadow-sm flex items-center justify-center"
        >
          <IoAdd className="w-5 h-5" />
        </button>
      </div>
      <button
        onClick={() => onRemove(item.product.id)}
        className="w-10 h-10 rounded-lg text-gray-400 bg-gray-50 border border-gray-200 active:text-white active:bg-red-500 active:border-red-500 transition-all transform active:scale-90 flex items-center justify-center"
      >
        <IoClose className="w-6 h-6" />
      </button>
    </div>
  );
};
