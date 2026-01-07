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
    <div className="fixed bottom-0 left-32 right-0 z-20">
      {/* Blur Background */}
      <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-xl border-t border-stone-800" />

      <div className="max-w-7xl mx-auto px-12 py-6 relative z-10">
        <div className="flex justify-between items-center">
          {/* Cart Info */}
          <div className="flex items-center space-x-8">
            {/* Item Count Badge */}
            <div className="relative">
              <div className="bg-stone-800 rounded-2xl p-4 shadow-inner border border-stone-700">
                <IoCart className="w-10 h-10 text-primary-500" />
              </div>
              <div className="absolute -top-2 -right-2 bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg border-2 border-stone-900">
                {itemCount}
              </div>
            </div>

            {/* Price Details */}
            <div>
              <p className="text-sm text-stone-400 mb-1 font-medium tracking-wide uppercase">
                Commande en cours
              </p>
              <p className="text-4xl font-serif font-bold text-white tracking-tight">
                {total.toFixed(2)}€
              </p>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => navigate('/checkout')}
            className="group relative overflow-hidden bg-primary-600 text-white px-12 py-6 rounded-2xl font-bold text-2xl shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-primary-600/30 flex items-center space-x-6"
          >
            <span className="relative z-10 tracking-widest font-serif">COMMANDER</span>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative z-10 group-hover:bg-white/30 transition-colors">
              <IoArrowForward className="w-6 h-6" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
