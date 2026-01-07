import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { IoAdd } from 'react-icons/io5';
import { AiFillStar } from 'react-icons/ai';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-stone-900 rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-stone-800 hover:border-primary-900"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden h-64">
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent z-10 opacity-60" />
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
        {product.popular && (
          <div className="absolute top-4 left-4 z-20 bg-primary-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg flex items-center gap-1">
            <AiFillStar className="w-3 h-3" />
            <span>Populaire</span>
          </div>
        )}

        {/* Add Button - Zen Style */}
        <div className="absolute bottom-4 right-4 z-20">
          <button className="bg-white text-stone-900 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white">
            <IoAdd className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif font-bold text-stone-100 leading-tight">
            {product.name}
          </h3>
          <span className="text-xl font-bold text-primary-400 whitespace-nowrap ml-4">
            {product.price.toFixed(2)}€
          </span>
        </div>

        <p className="text-sm text-stone-400 mb-4 line-clamp-2 leading-relaxed font-light">
          {product.description}
        </p>

        {/* Footer info if needed */}
        {product.calories && (
          <div className="flex items-center space-x-2 text-stone-600 text-xs uppercase tracking-wider font-semibold">
            <span>{product.calories} kcal</span>
          </div>
        )}
      </div>
    </div>
  );
};
