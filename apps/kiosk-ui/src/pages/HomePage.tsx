import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MdRestaurant, MdTakeoutDining } from 'react-icons/md';
import { GiHamburger } from 'react-icons/gi';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setOrderType } = useCart();

  const handleOrderTypeSelect = (type: 'dine-in' | 'takeout') => {
    setOrderType(type);
    navigate('/menu');
  };

  return (
    <div className="h-screen bg-white flex items-center justify-center p-6 overflow-hidden">
      <div className="max-w-5xl w-full">
        {/* Logo/Brand Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-900 rounded-2xl mb-6">
            <GiHamburger className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2">
            PAS LE TIME
          </h1>
          <p className="text-xl sm:text-2xl text-gray-500">
            Commandez rapidement
          </p>
        </div>

        {/* Order Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handleOrderTypeSelect('dine-in')}
            className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl p-10 sm:p-12 transition-all duration-200 active:scale-95"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-xl mx-auto mb-4 border border-gray-200">
              <MdRestaurant className="w-9 h-9 text-gray-900" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sur place</h2>
            <p className="text-base sm:text-lg text-gray-500">Profitez de votre repas ici</p>
          </button>

          <button
            onClick={() => handleOrderTypeSelect('takeout')}
            className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl p-10 sm:p-12 transition-all duration-200 active:scale-95"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-xl mx-auto mb-4 border border-gray-200">
              <MdTakeoutDining className="w-9 h-9 text-gray-900" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">À emporter</h2>
            <p className="text-base sm:text-lg text-gray-500">Emportez votre commande</p>
          </button>
        </div>
      </div>
    </div>
  );
};
