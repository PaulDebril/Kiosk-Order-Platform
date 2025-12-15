import React from 'react';
import type { Category } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="fixed left-0 top-0 bottom-0 w-32 bg-white shadow-xl z-30 flex flex-col border-r border-gray-200">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <CategoryIcon icon="burger" className="w-12 h-12 text-primary-600" />
        </div>
      </div>

      {/* Categories */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <div className="space-y-2 px-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full flex flex-col items-center justify-center py-5 px-3 rounded-xl transition-all duration-200 transform active:scale-95 ${
                activeCategory === category.id
                  ? 'bg-primary-600 shadow-lg text-amber-950'
                  : 'text-gray-600 bg-gray-50'
              }`}
            >
              <CategoryIcon 
                icon={category.icon} 
                className={`w-8 h-8 mb-2 ${activeCategory === category.id ? 'text-amber-950' : 'text-gray-700'}`} 
              />
              <span className="text-xs font-bold text-center leading-tight">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom Icon */}
      <div className="p-6 border-t border-gray-200">
        <button className="w-full flex flex-col items-center justify-center py-3 px-3 rounded-xl text-gray-500 bg-gray-50 transition-all active:scale-95">
          <IoInformationCircleOutline className="w-8 h-8" />
          <span className="text-xs mt-1 font-semibold">Info</span>
        </button>
      </div>
    </div>
  );
};
