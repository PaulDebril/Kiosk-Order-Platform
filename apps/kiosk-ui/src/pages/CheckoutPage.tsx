import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { IoArrowBack, IoCart } from 'react-icons/io5';
import { MdRestaurant, MdTakeoutDining } from 'react-icons/md';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateQuantity, removeItem, getTotal, clearCart } = useCart();

  const subtotal = getTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    // Simulate order placement
    const orderNumber = Math.floor(100 + Math.random() * 900).toString();
    clearCart();
    navigate('/confirmation', { state: { orderNumber, total } });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
              <IoCart className="w-16 h-16 text-gray-400" />
            </div>
          </div>
          <h2 className="text-5xl font-black text-gray-800 mb-6">
            Votre panier est vide
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Ajoutez des articles pour commencer votre commande
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-primary-600 text-white px-12 py-6 rounded-xl font-bold text-2xl shadow-lg transform transition-transform duration-200 active:scale-95"
          >
            Voir le Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-12 py-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/menu')}
            className="text-primary-600 font-bold text-lg flex items-center gap-3 transition-all active:scale-95"
          >
            <IoArrowBack className="w-8 h-8" />
            Retour au Menu
          </button>
          <h1 className="text-5xl font-black text-gray-900">Votre Commande</h1>
          <div className="w-32"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                  {state.orderType === 'dine-in' ? (
                    <><MdRestaurant className="w-8 h-8 text-primary-600" /> Sur Place</>
                  ) : (
                    <><MdTakeoutDining className="w-8 h-8 text-primary-600" /> À Emporter</>
                  )}
                </h2>
                <div className="bg-primary-50 text-primary-700 px-6 py-3 rounded-full font-bold text-lg">
                  {state.items.length} article{state.items.length > 1 ? 's' : ''}
                </div>
              </div>
              <div className="space-y-4">
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
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-8 sticky top-6 border border-gray-200">
              <h2 className="text-3xl font-black text-gray-900 mb-8">
                Résumé
              </h2>
              <div className="space-y-6 mb-8">
                <div className="flex justify-between text-lg text-gray-600">
                  <span className="font-semibold">Sous-total</span>
                  <span className="font-bold">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-lg text-gray-600">
                  <span className="font-semibold">TVA (10%)</span>
                  <span className="font-bold">{tax.toFixed(2)}€</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-gray-900">Total</span>
                    <span className="text-4xl font-black text-primary-600">{total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-primary-600 text-dark px-8 py-6 rounded-xl font-bold text-2xl shadow-lg transform transition-transform duration-200 active:scale-95 mb-4"
              >
                Valider la Commande
              </button>
              <button
                onClick={() => navigate('/menu')}
                className="w-full text-primary-600 font-bold text-lg py-4 transition-colors active:scale-95"
              >
                + Ajouter des articles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
