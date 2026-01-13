import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MdRestaurant, MdTakeoutDining } from 'react-icons/md';
import { IoArrowBack } from 'react-icons/io5';
import { CategoryIcon } from '../components/common/CategoryIcon';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setOrderType } = useCart();

  const handleOrderTypeSelect = (type: 'dine-in' | 'takeout') => {
    setOrderType(type);
    navigate('/menu');
  };

  return (
    <div className="h-screen bg-stone-900 flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/images/StartScreen.png')] opacity-10 bg-cover bg-center bg-fixed" />
      <div className="absolute inset-0 bg-stone-900/90" />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 p-4 rounded-full bg-stone-800/50 backdrop-blur-md text-white hover:bg-white hover:text-stone-900 transition-all z-20 shadow-lg"
      >
        <IoArrowBack className="w-8 h-8" />
      </button>

      <div className="max-w-6xl w-full relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-8 relative">
            <div className="absolute inset-0 bg-primary-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
            <CategoryIcon icon="sushi" className="w-20 h-20 text-primary-500 drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]" />
          </div>
          <h1 className="text-6xl sm:text-7xl font-black text-white mb-2 font-serif tracking-tight">
            Où souhaitez-vous<br />déguster ?
          </h1>
          <p className="text-2xl text-stone-400 font-light tracking-wide mt-4">
            Sélectionnez votre mode de dégustation
          </p>
        </div>

        {/* Order Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-12">
          {/* Sur Place */}
          <button
            onClick={() => handleOrderTypeSelect('dine-in')}
            className="group relative h-96 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-stone-800 hover:border-primary-600"
          >
            <div className="absolute inset-0 bg-stone-800/80 group-hover:bg-primary-900/90 transition-colors duration-500" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
              <div className="w-32 h-32 rounded-full bg-stone-700/50 group-hover:bg-primary-800/50 flex items-center justify-center mb-8 transition-colors duration-500 border border-stone-600 group-hover:border-primary-500">
                <MdRestaurant className="w-16 h-16 text-stone-300 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 font-serif">Sur place</h2>
              <p className="text-lg text-stone-400 group-hover:text-primary-100 transition-colors">Profitez de notre ambiance zen</p>
            </div>
          </button>

          {/* A Emporter */}
          <button
            onClick={() => handleOrderTypeSelect('takeout')}
            className="group relative h-96 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-stone-800 hover:border-primary-600"
          >
            <div className="absolute inset-0 bg-stone-800/80 group-hover:bg-stone-700/90 transition-colors duration-500" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
              <div className="w-32 h-32 rounded-full bg-stone-700/50 group-hover:bg-stone-600/50 flex items-center justify-center mb-8 transition-colors duration-500 border border-stone-600 group-hover:border-stone-400">
                <MdTakeoutDining className="w-16 h-16 text-stone-300 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 font-serif">À emporter</h2>
              <p className="text-lg text-stone-400 group-hover:text-stone-200 transition-colors">Savourez vos sushis chez vous</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
