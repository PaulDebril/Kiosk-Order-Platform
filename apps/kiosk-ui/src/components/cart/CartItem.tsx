import React from 'react';
import { IoRemove, IoAdd, IoClose } from 'react-icons/io5';
import type { CartItem as CartItemType } from '../../types';

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

  const totalPrice = item.product.price + (item.selectedOptions?.reduce((acc, opt) => acc + opt.price, 0) || 0);

  return (
    <div className="flex items-center gap-6 bg-stone-800/50 p-6 rounded-2xl border border-stone-700 hover:border-stone-600 transition-colors">
      <img
        src={item.product.image}
        alt={item.product.name}
        className="w-24 h-24 object-cover rounded-xl shadow-lg"
      />
      <div className="flex-1">
        <h4 className="font-bold text-xl text-white mb-2 font-serif">{item.product.name}</h4>

        {/* Options display */}
        {item.selectedOptions && item.selectedOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {item.selectedOptions.map((opt, idx) => (
              <span key={idx} className="text-xs text-stone-400 bg-stone-900 border border-stone-800 px-2 py-1 rounded-md">
                + {opt.name}
              </span>
            ))}
          </div>
        )}

        <p className="text-primary-500 font-bold text-xl">
          {totalPrice.toFixed(2)}€
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-4 bg-stone-900 rounded-xl p-2 border border-stone-700">
        <button
          onClick={handleDecrease}
          className="w-10 h-10 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white transition-all active:scale-95 flex items-center justify-center"
        >
          <IoRemove className="w-5 h-5" />
        </button>
        <span className="text-xl font-bold w-8 text-center text-white font-serif">{item.quantity}</span>
        <button
          onClick={handleIncrease}
          className="w-10 h-10 rounded-lg bg-stone-800 text-stone-300 hover:bg-primary-600 hover:text-white transition-all active:scale-95 flex items-center justify-center"
        >
          <IoAdd className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={() => onRemove(item.product.id)}
        className="w-10 h-10 rounded-lg text-stone-500 hover:text-red-500 hover:bg-stone-900 transition-all flex items-center justify-center"
      >
        <IoClose className="w-6 h-6" />
      </button>
    </div>
  );
};
