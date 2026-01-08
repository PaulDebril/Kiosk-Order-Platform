import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { IoArrowBack, IoCart, IoCard, IoCash } from 'react-icons/io5';
import { MdRestaurant, MdTakeoutDining } from 'react-icons/md';
import { orderService } from '../services';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateQuantity, removeItem, getTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

  const subtotal = getTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'card') {
      navigate('/payment');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate order placement
      const order = await orderService.createOrder(state.items, total, state.orderType || 'dine-in');
      clearCart();
      const orderNumber = order.orderNumber;
      // Pour l'instant on passe just les infos, le service a déjà créé l'ordre côté "backend"
      navigate('/confirmation', { state: { orderNumber, total, paymentMethod: 'cash', items: state.items } });
    } catch (error) {
      console.error("Order failed", error);
      setIsProcessing(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/StartScreen.png')] opacity-10 bg-cover bg-center" />
        <div className="max-w-xl w-full text-center relative z-10 p-12 bg-stone-800/50 backdrop-blur-xl rounded-3xl border border-stone-700 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <div className="w-32 h-32 bg-stone-700 rounded-full flex items-center justify-center animate-pulse">
              <IoCart className="w-16 h-16 text-stone-400" />
            </div>
          </div>
          <h2 className="text-4xl font-black text-white mb-6 font-serif">
            Votre panier est vide
          </h2>
          <p className="text-xl text-stone-400 mb-8 font-light">
            Nos chefs attendent votre sélection.
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-primary-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:bg-primary-500 hover:scale-105 transform transition-all duration-300"
          >
            Découvrir la Carte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Header */}
      <div className="bg-stone-900/80 backdrop-blur-md shadow-md border-b border-stone-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-12 py-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/menu')}
            className="text-stone-400 hover:text-white font-bold text-lg flex items-center gap-3 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center group-hover:bg-stone-700 transition-colors">
              <IoArrowBack className="w-6 h-6" />
            </div>
            <span>Retour au Menu</span>
          </button>
          <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Récapitulatif</h1>
          <div className="w-32"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-stone-900 rounded-3xl shadow-xl p-8 border border-stone-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              <div className="flex items-center justify-between mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-white flex items-center gap-4">
                  {state.orderType === 'dine-in' ? (
                    <><div className="p-3 bg-stone-800 rounded-xl"><MdRestaurant className="w-6 h-6 text-primary-500" /></div> Sur Place</>
                  ) : (
                    <><div className="p-3 bg-stone-800 rounded-xl"><MdTakeoutDining className="w-6 h-6 text-primary-500" /></div> À Emporter</>
                  )}
                </h2>
                <div className="bg-primary-900/30 border border-primary-500/30 text-primary-400 px-4 py-2 rounded-full font-bold text-sm tracking-wider uppercase">
                  {state.items.length} article{state.items.length > 1 ? 's' : ''}
                </div>
              </div>

              <div className="space-y-6">
                {state.items.map((item) => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-stone-900 rounded-3xl shadow-xl p-8 border border-stone-800">
              <h2 className="text-2xl font-bold text-white mb-6">Moyen de paiement</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 ${paymentMethod === 'card'
                    ? 'border-primary-600 bg-primary-900/20 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                    : 'border-stone-700 bg-stone-800/50 text-stone-400 hover:bg-stone-800'
                    }`}
                >
                  <IoCard className={`w-8 h-8 ${paymentMethod === 'card' ? 'text-primary-500' : 'text-stone-500'}`} />
                  <div className="text-left">
                    <div className="font-bold">Carte Bancaire</div>
                    <div className="text-xs text-stone-400">Visa, Mastercard</div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 ${paymentMethod === 'cash'
                    ? 'border-primary-600 bg-primary-900/20 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
                    : 'border-stone-700 bg-stone-800/50 text-stone-400 hover:bg-stone-800'
                    }`}
                >
                  <IoCash className={`w-8 h-8 ${paymentMethod === 'cash' ? 'text-primary-500' : 'text-stone-500'}`} />
                  <div className="text-left">
                    <div className="font-bold">Espèces</div>
                    <div className="text-xs text-stone-400">Au comptoir uniquement</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-stone-900 rounded-3xl shadow-xl p-8 sticky top-28 border border-stone-800">
              <h2 className="text-2xl font-serif font-bold text-white mb-8 border-b border-stone-800 pb-4">
                Total à payer
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-stone-400">
                  <span className="font-medium">Sous-total</span>
                  <span className="font-bold text-stone-200">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span className="font-medium">TVA (10%)</span>
                  <span className="font-bold text-stone-200">{tax.toFixed(2)}€</span>
                </div>
                <div className="border-t border-stone-800 pt-6 mt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xl font-bold text-stone-300">Total TTC</span>
                    <span className="text-5xl font-serif font-bold text-primary-500">{total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-primary-600 text-white px-8 py-6 rounded-2xl font-bold text-xl shadow-[0_0_30px_rgba(225,29,72,0.4)] hover:shadow-[0_0_40px_rgba(225,29,72,0.6)] transform transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Traitement...</span>
                  </>
                ) : (
                  <span>
                    {paymentMethod === 'card' ? 'Payer par Carte' : 'Valider la commande'}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate('/menu')}
                className="w-full mt-4 text-stone-500 font-medium text-sm py-3 transition-colors hover:text-stone-300 uppercase tracking-wide"
              >
                Ajouter d'autres articles
              </button>

              <div className="mt-8 flex items-center justify-center gap-2 text-stone-600 text-xs text-center">
                <IoCard />
                <span>Paiement 100% sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
