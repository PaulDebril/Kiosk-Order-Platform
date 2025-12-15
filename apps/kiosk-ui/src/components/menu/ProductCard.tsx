import React from 'react';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../types';
import { IoAddCircle } from 'react-icons/io5';
import { AiFillStar } from 'react-icons/ai';
import { MdLocalFireDepartment } from 'react-icons/md';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div
      onClick={handleAddToCart}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transform transition-transform duration-200 active:scale-95 border border-gray-200"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover"
        />
        {product.popular && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
            <AiFillStar className="w-4 h-4" />
            <span>Populaire</span>
          </div>
        )}
        
        {/* Add Icon Indicator */}
        <div className="absolute bottom-4 right-4 bg-primary-600 text-white p-2.5 rounded-full shadow-xl">
          <IoAddCircle className="w-6 h-6" />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        {/* Price and Calories */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-3xl font-black text-primary-600">
            {product.price.toFixed(2)}€
          </span>
          {product.calories && (
            <div className="flex items-center space-x-1 text-gray-500">
              <MdLocalFireDepartment className="w-4 h-4" />
              <span className="text-xs font-semibold">{product.calories} cal</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
