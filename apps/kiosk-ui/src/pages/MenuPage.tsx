import React, { useState, useEffect, useMemo } from 'react';
import { CategoryNav } from '../components/menu/CategoryNav';
import { ProductCard } from '../components/menu/ProductCard';
import { CartSummary } from '../components/cart/CartSummary';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { productService } from '../services';
import type { Category, Product } from '../types';

export const MenuPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Chargement parallèle des catégories et produits
        const [cats, prods] = await Promise.all([
          productService.getCategories(),
          productService.getAllProducts()
        ]);

        setCategories(cats);
        setProducts(prods);

        // Sélectionner la première catégorie par défaut
        if (cats.length > 0 && !activeCategory) {
          setActiveCategory(cats[0].id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return [];
    const category = categories.find((cat) => cat.id === activeCategory);
    return products.filter((product) => product.category === category?.name);
  }, [activeCategory, categories, products]);

  const activeCategoryName = categories.find((cat) => cat.id === activeCategory)?.name;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-stone-400">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Sidebar Navigation */}
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Main Content with left margin for sidebar */}
      <div className="ml-32 pb-32">
        {/* Header Banner - Zen Theme */}
        <div className="bg-stone-900 border-b border-stone-800 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="max-w-7xl mx-auto px-12 py-12 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-black mb-2 text-white font-serif tracking-tight">Menu</h1>
                <p className="text-xl text-stone-400 font-light flex items-center gap-2">
                  <span className="text-primary-500 font-bold uppercase tracking-widest text-sm">{activeCategoryName}</span>
                  <span className="w-1 h-1 rounded-full bg-stone-600"></span>
                  <span>Sélection du chef</span>
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
            <div className="text-center py-32 flex flex-col items-center">
              <div className="w-24 h-24 bg-stone-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <CategoryIcon icon="sushi" className="w-12 h-12 text-stone-600" />
              </div>
              <h3 className="text-3xl font-bold text-stone-300 mb-2 font-serif">
                Bientôt disponible
              </h3>
              <p className="text-stone-500">
                Nos chefs préparent cette catégorie
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
