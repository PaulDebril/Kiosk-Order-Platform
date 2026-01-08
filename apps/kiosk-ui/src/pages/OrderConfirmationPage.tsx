import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoCheckmarkCircle, IoTime, IoReceipt, IoPrint } from 'react-icons/io5';
import { systemService } from '../services/systemService';

export const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderNumber, total, paymentMethod, items } = location.state || {};
  const [isPrinting, setIsPrinting] = useState(false);
  const [showPrintSuccess, setShowPrintSuccess] = useState(false);

  // Si on n'a pas de numéro de commande (accès direct à la page), on renvoie à l'accueil
  useEffect(() => {
    if (!orderNumber) {
      navigate('/');
    }
  }, [orderNumber, navigate]);

  const handleNewOrder = () => {
    navigate('/');
  };

  // Fonction pour imprimer le reçu via le service système
  const handlePrintReceipt = async () => {
    setIsPrinting(true);
    try {
      await systemService.printOrder({
        id: orderNumber,
        orderNumber: orderNumber,
        total: total,
        items: items || [],
        paymentMethod: paymentMethod,
        date: new Date().toISOString()
      });
      setIsPrinting(false);
      setShowPrintSuccess(true);

      // On cache le message de succès après 3 secondes
      setTimeout(() => setShowPrintSuccess(false), 3000);
    } catch (e) {
      console.error("L'impression a échoué", e);
      setIsPrinting(false);
      alert("Mince, impossible d'imprimer le ticket.");
    }
  };

  // On redirige automatiquement vers l'accueil après 60 secondes d'inactivité
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 60000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen bg-stone-950 flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
      {/* Ambiance de fond avec l'image StartScreen en transparence */}
      <div className="absolute inset-0 bg-[url('/images/StartScreen.png')] opacity-10 bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/90 to-transparent" />

      {/* Overlay qui s'affiche pendant l'impression */}
      {isPrinting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 backdrop-blur-md">
          <div className="flex flex-col items-center animate-pulse">
            <IoPrint className="w-20 h-20 text-primary-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Impression en cours...</h2>
            <p className="text-stone-400">Veuillez patienter</p>
          </div>
        </div>
      )}

      {/* Notification de succès d'impression */}
      {showPrintSuccess && (
        <div className="fixed top-10 z-50 bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-slide-down">
          <IoCheckmarkCircle className="w-8 h-8" />
          <span className="font-bold text-xl">Ticket Imprimé !</span>
        </div>
      )}

      {/* Conteneur du ticket visuel */}
      <div className="max-w-xl w-full relative z-10 animate-slide-up">

        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
          {/* Petite barre de couleur dégradée en haut du ticket */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 via-yellow-500 to-primary-600" />

          {/* Icône de succès avec effet de lumière */}
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto relative z-10 shadow-[0_0_20px_rgba(34,197,94,0.6)]">
              <IoCheckmarkCircle className="w-16 h-16 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-serif font-bold text-white mb-4">
            Commande Confirmée !
          </h1>
          <p className="text-stone-400 text-lg mb-10 font-light">
            {paymentMethod === 'cash' ? (
              <>
                Rendez-vous à la caisse avec votre ticket<br />
                pour finaliser votre commande.
              </>
            ) : (
              <>Merci de faire confiance à <span className="font-bold text-white">ZEN</span><span className="text-primary-500 font-bold">ITO</span></>
            )}
          </p>

          {/* Infos principales de la commande */}
          <div className="bg-stone-800/50 rounded-2xl p-8 mb-10 border border-stone-700/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 mb-6 border-b border-stone-700 pb-6">
              <span className="text-stone-500 text-sm uppercase tracking-widest font-bold">Numéro de commande</span>
              <span className="text-7xl font-black text-white font-mono tracking-tighter">
                #{orderNumber}
              </span>
            </div>

            <div className="flex justify-between items-center text-stone-300">
              <div className="flex items-center gap-2">
                <IoReceipt className="text-primary-500" />
                <span>
                  {paymentMethod === 'cash' ? 'Total à payer au comptoir' : 'Total payé'}
                </span>
              </div>
              <span className="text-2xl font-serif font-bold text-primary-400">
                {total?.toFixed(2)} €
              </span>
            </div>
          </div>

          {/* Estimation du temps de préparation */}
          <div className="flex items-center justify-center gap-3 text-stone-400 mb-8 bg-stone-950/50 py-3 px-6 rounded-full inline-flex">
            <IoTime className="w-5 h-5 text-yellow-500" />
            <span>Préparation estimée : 10-15 min</span>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col gap-4">
            <button
              onClick={handlePrintReceipt}
              className="w-full bg-stone-800 hover:bg-stone-700 text-stone-300 px-8 py-4 rounded-xl font-bold text-lg shadow-sm border border-stone-700 transition-all flex items-center justify-center gap-3"
            >
              <IoPrint className="w-6 h-6" />
              Imprimer mon reçu
            </button>

            <button
              onClick={handleNewOrder}
              className="w-full bg-stone-100 hover:bg-white text-stone-900 px-8 py-5 rounded-xl font-bold text-xl shadow-lg transition-all active:scale-95"
            >
              Nouvelle Commande
            </button>
          </div>

          <p className="text-stone-600 text-sm mt-8 animate-pulse">
            Retour automatique à l'accueil dans quelques secondes...
          </p>

        </div>

        {/* Effet de ticket déchiré en bas (visuel uniquement) */}
        <div className="w-full h-4 bg-stone-950 -mt-2 relative z-20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full flex" style={{ transform: 'translateY(-50%)' }}>
            {[...Array(40)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-stone-900 rounded-full mx-1" />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

