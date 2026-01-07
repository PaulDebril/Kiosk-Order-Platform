import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { IoCloseCircleOutline, IoWarning } from 'react-icons/io5';
import type { Category } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const confirmCancelOrder = () => {
    clearCart();
    navigate('/');
  };

  return (
    <>
      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setShowCancelModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-stone-900 border border-stone-800 rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all scale-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mb-6">
              <IoWarning className="w-10 h-10 text-red-500" />
            </div>

            <h2 className="text-2xl font-serif font-bold text-white mb-2">Annuler la commande ?</h2>
            <p className="text-stone-400 mb-8">
              Vous allez perdre votre panier actuel et retourner à l'écran d'accueil.
            </p>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-4 rounded-xl font-bold bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors"
              >
                Continuer
              </button>
              <button
                onClick={confirmCancelOrder}
                className="flex-1 py-4 rounded-xl font-bold bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20 transition-all"
              >
                Oui, annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed left-0 top-0 bottom-0 w-32 bg-stone-900 shadow-xl z-30 flex flex-col border-r border-stone-800">
        {/* Logo Section */}
        <div className="p-6 border-b border-stone-800">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center p-3 shadow-[0_0_15px_rgba(225,29,72,0.5)]">
              <CategoryIcon icon="sushi" className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        {/* Categories */}
        <nav className="flex-1 overflow-y-auto py-6 scrollbar-hide">
          <div className="space-y-4 px-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`w-full flex flex-col items-center justify-center py-6 px-2 rounded-2xl transition-all duration-300 transform border ${activeCategory === category.id
                  ? 'bg-stone-800 border-primary-600 text-primary-500 shadow-lg scale-105'
                  : 'text-stone-400 bg-transparent border-transparent hover:bg-stone-800/50 hover:text-stone-200'
                  }`}
              >
                <CategoryIcon
                  icon={category.icon}
                  className={`w-8 h-8 mb-3 transition-colors duration-300 ${activeCategory === category.id ? 'text-primary-500' : 'text-stone-500 group-hover:text-stone-300'}`}
                />
                <span className={`text-[11px] font-bold text-center leading-tight tracking-wide uppercase transition-colors duration-300 ${activeCategory === category.id ? 'text-primary-100' : ''}`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom Cancel Icon */}
        <div className="p-4 border-t border-stone-800">
          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full flex flex-col items-center justify-center py-4 px-3 rounded-2xl text-stone-500 hover:bg-red-900/20 hover:text-red-500 hover:border-red-500/30 border border-transparent transition-all active:scale-95 group"
            title="Annuler la commande"
          >
            <IoCloseCircleOutline className="w-8 h-8 mb-1 group-hover:text-red-500 transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-red-500">Annuler</span>
          </button>
        </div>
      </div>
    </>
  );
};
