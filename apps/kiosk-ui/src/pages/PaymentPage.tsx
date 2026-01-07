import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services';
import { IoCard, IoCheckmarkCircle, IoWarning } from 'react-icons/io5';
import { MdNfc } from 'react-icons/md';

export const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const { state, getTotal, clearCart } = useCart();
    const [status, setStatus] = useState<'waiting' | 'processing' | 'approved' | 'error'>('waiting');

    const total = getTotal();

    useEffect(() => {
        // Si le panier est vide, retour au début (sécurité), sauf si le paiement est approuvé (le panier vient d'être vidé)
        if (state.items.length === 0 && status !== 'approved') {
            navigate('/');
        }
    }, [state.items.length, navigate, status]);

    const handlePaymentSimulation = async () => {
        setStatus('processing');

        // Simulation du temps de traitement bancaire
        setTimeout(async () => {
            try {
                // Création de la commande
                const order = await orderService.createOrder(state.items, total, state.orderType || 'dine-in');
                setStatus('approved');

                // Attente courte sur l'écran succès avant redirection
                setTimeout(() => {
                    clearCart();
                    navigate('/confirmation', { state: { orderNumber: order.orderNumber, total, paymentMethod: 'card' } });
                }, 1500);
            } catch (error) {
                console.error("Payment failed", error);
                setStatus('error');
                // Reset après erreur pour réessayer
                setTimeout(() => setStatus('waiting'), 3000);
            }
        }, 3000); // 3 secondes de "traitement"
    };

    // Démarrage automatique de la simulation quand on arrive sur la page (ou clic bouton)
    // Pour l'UX, on peut demander de cliquer ou simuler l'insertion carte.
    // Faisons un bouton pour simuler "Insérer Carte / Sans Contact"

    return (
        <div className="h-screen bg-stone-950 flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
            <div className="absolute inset-0 bg-[url('/images/StartScreen.png')] opacity-10 bg-cover bg-center" />

            <div className="max-w-md w-full bg-stone-900 rounded-3xl p-8 border border-stone-800 shadow-2xl relative z-10 text-center">

                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold mb-2">Paiement</h1>
                    <p className="text-stone-400">Total à régler</p>
                    <p className="text-4xl font-bold text-primary-500 mt-2">{total.toFixed(2)}€</p>
                </div>

                <div className="h-64 flex flex-col items-center justify-center mb-8 bg-stone-950/50 rounded-2xl border border-stone-800 relative overflow-hidden">

                    {status === 'waiting' && (
                        <div className="flex flex-col items-center animate-pulse">
                            <MdNfc className="w-24 h-24 text-stone-600 mb-4" />
                            <p className="text-stone-400 font-medium">Approchez votre carte ou téléphone</p>
                        </div>
                    )}

                    {status === 'processing' && (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 border-4 border-primary-900 border-t-primary-500 rounded-full animate-spin mb-6" />
                            <p className="text-stone-300 font-bold uppercase tracking-widest text-sm">Traitement en cours...</p>
                            <p className="text-xs text-stone-500 mt-2">Ne retirez pas votre carte</p>
                        </div>
                    )}

                    {status === 'approved' && (
                        <div className="flex flex-col items-center animate-fade-in">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                                <IoCheckmarkCircle className="w-12 h-12 text-white" />
                            </div>
                            <p className="text-green-400 font-bold text-xl uppercase tracking-widest">Paiement Accepté</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center animate-bounce">
                            <IoWarning className="w-20 h-20 text-red-500 mb-4" />
                            <p className="text-red-400 font-bold">Erreur de lecture</p>
                            <p className="text-xs text-stone-500 mt-2">Veuillez réessayer</p>
                        </div>
                    )}
                </div>

                {status === 'waiting' && (
                    <button
                        onClick={handlePaymentSimulation}
                        className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <IoCard className="w-6 h-6" />
                        <span>Payer maintenant</span>
                    </button>
                )}

                {status === 'processing' && (
                    <button disabled className="w-full bg-stone-800 text-stone-500 font-bold py-4 rounded-xl cursor-not-allowed">
                        Veuillez patienter...
                    </button>
                )}

            </div>
        </div>
    );
};
