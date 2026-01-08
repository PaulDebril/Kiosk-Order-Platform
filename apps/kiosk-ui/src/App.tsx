import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { StartScreen } from './pages/StartScreen';
import { LoyaltyPage } from './pages/LoyaltyPage';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentPage } from './pages/PaymentPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';

function App() {
  return (
    // On entoure toute l'app avec le provider du panier pour y avoir accès partout
    <CartProvider>
      <Router>
        <Routes>
          {/* Écran d'accueil pour commencer la commande */}
          <Route path="/" element={<StartScreen />} />

          {/* Programme de fidélité */}
          <Route path="/loyalty" element={<LoyaltyPage />} />

          {/* Sélection sur place ou à emporter */}
          <Route path="/home" element={<HomePage />} />

          {/* Le menu avec toutes les catégories */}
          <Route path="/menu" element={<MenuPage />} />

          {/* Détails d'un produit spécifique */}
          <Route path="/product/:productId" element={<ProductDetailsPage />} />

          {/* Récapitulatif du panier avant de payer */}
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Écran de paiement (simulation) */}
          <Route path="/payment" element={<PaymentPage />} />

          {/* Confirmation finale et impression du ticket */}
          <Route path="/confirmation" element={<OrderConfirmationPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;

