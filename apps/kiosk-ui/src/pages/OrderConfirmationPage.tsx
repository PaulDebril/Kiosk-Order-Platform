import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoCheckmarkCircle, IoTime } from 'react-icons/io5';

export const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderNumber, total } = location.state || {};

  useEffect(() => {
    if (!orderNumber) {
      navigate('/');
    }
  }, [orderNumber, navigate]);

  const handleNewOrder = () => {
    navigate('/');
  };

  // Auto-redirect after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 30000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen bg-white flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-2xl w-full text-center max-h-[95vh] overflow-y-auto">
        {/* Success Animation */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500 rounded-full flex items-center justify-center">
              <IoCheckmarkCircle className="w-14 h-14 sm:w-16 sm:h-16 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Commande confirmée
          </h1>
          <p className="text-lg sm:text-xl text-gray-500">
            Merci pour votre commande
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-2xl p-8 sm:p-10 mb-8">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Numéro de commande</p>
            <p className="text-5xl sm:text-6xl font-bold text-gray-900">#{orderNumber}</p>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Montant total</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">
              {total?.toFixed(2)} €
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 text-gray-600">
            <IoTime className="w-6 h-6" />
            <p className="text-base sm:text-lg">
              Votre commande sera bientôt prête
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={handleNewOrder}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white px-8 py-5 sm:py-6 rounded-xl font-semibold text-lg sm:text-xl transition-all duration-200 active:scale-95"
          >
            Nouvelle commande
          </button>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <IoTime className="w-4 h-4" />
            <p className="text-sm">
              Retour automatique dans 30 secondes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
