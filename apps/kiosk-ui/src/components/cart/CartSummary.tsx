import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { IoCart, IoArrowForward } from 'react-icons/io5';

export const CartSummary: React.FC = () => {
  const { getTotal, getItemCount } = useCart();
  const navigate = useNavigate();

  const itemCount = getItemCount();
  const subtotal = getTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-32 right-0 bg-white shadow-2xl z-20 border-t-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-12 py-6">
        <div className="flex justify-between items-center">
          {/* Cart Info */}
          <div className="flex items-center space-x-8">
            {/* Item Count Badge */}
            <div className="relative">
              <div className="bg-primary-600 rounded-xl p-4 shadow-lg">
                <IoCart className="w-10 h-10 text-black" />
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center font-black text-sm shadow-lg">
                {itemCount}
              </div>
            </div>

            {/* Price Details */}
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">
                {itemCount} article{itemCount > 1 ? 's' : ''} dans votre panier
              </p>
              <p className="text-4xl font-black text-gray-900">
                {total.toFixed(2)}€
              </p>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => navigate('/checkout')}
            className="bg-white border-2 border-amber-400 text-black px-12 py-6 rounded-xl font-bold text-2xl shadow-lg transform transition-transform duration-200 active:scale-95 flex items-center space-x-4"
          >
            <span>Voir le panier</span>
            <IoArrowForward className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};
