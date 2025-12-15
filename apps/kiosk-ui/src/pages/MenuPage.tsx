import React, { useState, useMemo } from 'react';
import { CategoryNav } from '../components/menu/CategoryNav';
import { ProductCard } from '../components/menu/ProductCard';
import { CartSummary } from '../components/cart/CartSummary';
import { categories, products } from '../data/mockData';
import { CategoryIcon } from '../components/common/CategoryIcon';

export const MenuPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const filteredProducts = useMemo(() => {
    const category = categories.find((cat) => cat.id === activeCategory);
    return products.filter((product) => product.category === category?.name);
  }, [activeCategory]);

  const activeCategoryName = categories.find((cat) => cat.id === activeCategory)?.name;
  const activeCategoryIcon = categories.find((cat) => cat.id === activeCategory)?.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Main Content with left margin for sidebar */}
      <div className="ml-32 pb-32">
        {/* Header Banner - White theme */}
        <div className="bg-white border-b-2 border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-12 py-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-black mb-2 text-gray-900">Notre Menu</h1>
                <p className="text-xl text-gray-600 font-medium">
                  {activeCategoryName} - Touchez pour sélectionner
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="mb-6 flex items-center justify-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                  <CategoryIcon icon="burger" className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                Aucun produit disponible
              </h3>
              <p className="text-xl text-gray-600">
                Veuillez sélectionner une autre catégorie
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Summary */}
      <CartSummary />
    </div>
  );
};
