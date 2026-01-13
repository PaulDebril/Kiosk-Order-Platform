import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';

export const LoyaltyPage: React.FC = () => {
  const navigate = useNavigate();
  const [loyaltyCode, setLoyaltyCode] = useState('');

  const handleSkip = () => {
    navigate('/home');
  };

  const handleSubmit = () => {
    // TODO: Implement loyalty code validation
    console.log('Loyalty code:', loyaltyCode);
    navigate('/home');
  };

  const handleKeypadClick = (num: string) => {
    if (loyaltyCode.length < 6) {
      setLoyaltyCode(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setLoyaltyCode(prev => prev.slice(0, -1));
  };

  return (
    <div className="h-screen bg-stone-900 flex overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/images/StartScreen.png')] opacity-20 bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-900/95 to-stone-800/90" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex h-full">

        {/* Left Side: Illustration / Welcome */}
        <div className="w-1/2 flex flex-col justify-center px-12 text-white">
          <div className="mb-12">
            <h2 className="text-primary-500 font-bold uppercase tracking-widest mb-4">Programme Fidélité</h2>
            <h1 className="text-6xl font-serif font-black mb-6 leading-tight">
              Bienvenue chez<br />
              <span className="text-white">ZEN</span><span className="text-primary-500">ITO</span>
            </h1>
            <p className="text-stone-400 text-xl font-light leading-relaxed max-w-lg">
              Identifiez-vous pour cumuler des points et profiter de récompenses exclusives sur votre commande.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-stone-800/50 backdrop-blur-md p-6 rounded-2xl border border-stone-700 w-64">
              <div className="text-3xl font-bold text-white mb-2 font-serif">10%</div>
              <div className="text-stone-400 text-sm">de réduction immédiate sur le menu découverte</div>
            </div>
          </div>
        </div>

        {/* Right Side: Keypad & Input */}
        <div className="w-1/2 bg-stone-800/50 backdrop-blur-xl border-l border-stone-700/50 p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">

            {/* Display Screen */}
            <div className="bg-stone-900 border-2 border-primary-900/50 p-8 rounded-3xl mb-8 text-center shadow-2xl relative">
              <div className="text-stone-500 text-sm uppercase tracking-wider mb-2">Code Client</div>
              <div className="h-16 flex items-center justify-center gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${i < loyaltyCode.length ? 'bg-primary-500 scale-125 shadow-[0_0_10px_#f43f5e]' : 'bg-stone-700'
                      }`}
                  />
                ))}
              </div>
              {loyaltyCode.length === 0 && (
                <div className="absolute inset-x-0 bottom-4 text-xs text-stone-600 animate-pulse">
                  Tapez votre code à 6 chiffres
                </div>
              )}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeypadClick(num.toString())}
                  className="h-20 bg-stone-800 border-b-4 border-stone-950 active:border-b-0 active:translate-y-1 rounded-2xl text-3xl font-bold text-white shadow-lg hover:bg-stone-700 transition-all"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleBackspace}
                className="h-20 bg-primary-600 disabled:bg-stone-800 disabled:text-stone-600 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all"
              >
                <IoArrowBack className="w-8 h-8" />
              </button>
              <button
                onClick={() => handleKeypadClick('0')}
                className="h-20 bg-stone-800 border-b-4 border-stone-950 active:border-b-0 active:translate-y-1 rounded-2xl text-3xl font-bold text-white shadow-lg hover:bg-stone-700 transition-all"
              >
                0
              </button>
              <button
                onClick={handleSubmit}
                disabled={loyaltyCode.length < 6}
                className="h-20 bg-primary-600 disabled:bg-stone-800 disabled:text-stone-600 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all"
              >
                <IoArrowForward className="w-8 h-8" />
              </button>
            </div>

            <button
              onClick={handleSkip}
              className="w-full py-4 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-all uppercase tracking-wide text-sm font-bold"
            >
              Non merci, continuer sans compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
