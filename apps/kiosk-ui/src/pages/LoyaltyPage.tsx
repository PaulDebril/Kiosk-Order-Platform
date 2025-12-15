import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdQrCodeScanner } from 'react-icons/md';
import { IoArrowForward } from 'react-icons/io5';

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

  return (
    <div className="h-screen bg-white flex items-center justify-center p-6 overflow-hidden">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-24 h-24 bg-gray-900 rounded-2xl flex items-center justify-center">
            <MdQrCodeScanner className="w-14 h-14 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Carte de fidélité
        </h1>
        <p className="text-xl sm:text-2xl text-gray-500 mb-12">
          Scannez ou saisissez votre code pour bénéficier de vos avantages
        </p>

        {/* Input */}
        <div className="mb-8">
          <input
            type="text"
            value={loyaltyCode}
            onChange={(e) => setLoyaltyCode(e.target.value)}
            placeholder="Code de fidélité"
            className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-center text-xl sm:text-2xl"
          />
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleSubmit}
            disabled={!loyaltyCode}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-5 rounded-xl font-bold text-xl sm:text-2xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-3"
          >
            <span>Valider</span>
            <IoArrowForward className="w-6 h-6" />
          </button>

          <button
            onClick={handleSkip}
            className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 px-8 py-5 rounded-xl font-semibold text-lg sm:text-xl transition-all duration-200 active:scale-95"
          >
            Continuer sans carte
          </button>
        </div>

        {/* Info */}
        <p className="text-gray-400 text-sm mt-8">
          Vous n'avez pas de carte ? Demandez-la à la caisse
        </p>
      </div>
    </div>
  );
};
