import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoArrowForward, IoQrCode, IoKeypad, IoEye, IoEyeOff } from 'react-icons/io5';
import { QRScanner } from '../components/common/QRScanner';
import { useCart } from '../context/CartContext';
import { loyaltyService } from '../services';

export const LoyaltyPage: React.FC = () => {
  const navigate = useNavigate();
  const { setLoyaltyUser } = useCart();
  const [loyaltyCode, setLoyaltyCode] = useState('');
  const [inputMode, setInputMode] = useState<'choice' | 'manual' | 'scan'>('choice');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleSkip = () => {
    setLoyaltyUser(null);
    navigate('/home');
  };

  const handleSubmit = async (codeToSubmit?: string) => {
    const finalCode = codeToSubmit || loyaltyCode;
    console.log('Loyalty code:', finalCode);
    
    setIsValidating(true);
    setError('');
    
    try {
      const user = await loyaltyService.validateCode(finalCode);
      
      if (user) {
        console.log('Utilisateur trouvé:', user);
        setLoyaltyUser(user);
        navigate('/home');
      } else {
        setError('Code fidélité non reconnu');
        setIsValidating(false);
      }
    } catch (err) {
      console.error('Erreur validation:', err);
      setError('Erreur lors de la validation');
      setIsValidating(false);
    }
  };

  const handleKeypadClick = (num: string) => {
    if (loyaltyCode.length < 6) {
      setLoyaltyCode(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setLoyaltyCode(prev => prev.slice(0, -1));
  };

  const handleQRScan = async (code: string) => {
    const scannedCode = code.substring(0, 6);
    setLoyaltyCode(scannedCode);
    
    if (scannedCode.length >= 6) {
      setIsValidating(true);
      setError('');
      
      try {
        const user = await loyaltyService.validateCode(scannedCode);
        
        if (user) {
          console.log('Utilisateur trouvé:', user);
          setLoyaltyUser(user);
          setInputMode('choice'); 
          navigate('/home');
        } else {
          setError('Code fidélité non reconnu. Veuillez réessayer.');
          setIsValidating(false);
        }
      } catch (err) {
        console.error('Erreur validation:', err);
        setError('Code fidélité invalide. Veuillez réessayer.');
        setIsValidating(false);
      }
    }
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

            {/* Choice Mode: Two Buttons */}
            {inputMode === 'choice' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white text-center mb-8 font-serif">
                  Comment souhaitez-vous vous identifier ?
                </h3>

                {/* QR Code Button */}
                <button
                  onClick={() => setInputMode('scan')}
                  className="w-full h-32 bg-stone-800 hover:bg-stone-700 text-white rounded-2xl font-bold text-xl shadow-xl transition-all flex items-center justify-center gap-4 border-b-4 border-stone-950 active:border-b-0 active:translate-y-1"
                >
                  <IoQrCode className="w-12 h-12" />
                  <span className="font-serif">Scanner un QR Code</span>
                </button>

                {/* Manual Input Button */}
                <button
                  onClick={() => setInputMode('manual')}
                  className="w-full h-32 bg-stone-800 hover:bg-stone-700 text-white rounded-2xl font-bold text-xl shadow-xl transition-all flex items-center justify-center gap-4 border-b-4 border-stone-950 active:border-b-0 active:translate-y-1"
                >
                  <IoKeypad className="w-12 h-12" />
                  <span className="font-serif">Saisir manuellement</span>
                </button>

                {/* Skip Button */}
                <button
                  onClick={handleSkip}
                  className="w-full py-4 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-all uppercase tracking-wide text-sm font-bold mt-8"
                >
                  Non merci, continuer sans compte
                </button>
              </div>
            )}

            {/* Manual Input Mode: Keypad */}
            {inputMode === 'manual' && (
              <>
                {/* Back to Choice Button */}
                <button
                  onClick={() => setInputMode('choice')}
                  className="mb-6 flex items-center gap-2 text-stone-400 hover:text-white transition-all"
                >
                  <IoArrowBack className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wide">Retour</span>
                </button>

                {/* Display Screen */}
                <div className="bg-stone-900 border-2 border-primary-900/50 p-8 rounded-3xl mb-8 text-center shadow-2xl relative">
                  <div className="text-stone-500 text-sm uppercase tracking-wider mb-2">Code Client</div>
                  <div className="h-16 flex items-center justify-center gap-6">
                    {showCode ? (
                      // Show actual digits
                      <div className="text-4xl font-bold text-white tracking-[0.5em] font-mono">
                        {loyaltyCode || '______'}
                      </div>
                    ) : (
                      // Show dots
                      [...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full transition-all duration-300 ${
                            i < loyaltyCode.length ? 'bg-primary-500 scale-125 shadow-[0_0_10px_#f43f5e]' : 'bg-stone-700'
                          }`}
                        />
                      ))
                    )}
                    {/* Eye Icon Toggle */}
                    <button
                      onClick={() => setShowCode(!showCode)}
                      className="text-stone-400 hover:text-white transition-colors"
                    >
                      {showCode ? <IoEyeOff className="w-8 h-8" /> : <IoEye className="w-8 h-8" />}
                    </button>
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
                    onClick={() => handleSubmit()}
                    disabled={loyaltyCode.length === 0 || isValidating}
                    className="h-20 bg-primary-600 disabled:bg-stone-800 disabled:text-stone-600 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all"
                  >
                    {isValidating ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <IoArrowForward className="w-8 h-8" />
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200 text-center">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSkip}
                  className="w-full py-4 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-all uppercase tracking-wide text-sm font-bold"
                >
                  Non merci, continuer sans compte
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {inputMode === 'scan' && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => {
            setInputMode('choice');
            setError('');
          }}
          validationError={error}
        />
      )}
    </div>
  );
};
