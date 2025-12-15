import React from 'react';
import { 
  GiHamburger, 
  GiChickenOven, 
  GiFrenchFries, 
  GiSodaCan,
  GiIceCreamCone
} from 'react-icons/gi';
import { IoLeafOutline } from 'react-icons/io5';

interface CategoryIconProps {
  icon: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ icon, className = "w-8 h-8" }) => {
  const iconMap: Record<string, React.ReactElement> = {
    burger: <GiHamburger className={className} />,
    chicken: <GiChickenOven className={className} />,
    fries: <GiFrenchFries className={className} />,
    drink: <GiSodaCan className={className} />,
    dessert: <GiIceCreamCone className={className} />,
    salad: <IoLeafOutline className={className} />,
  };

  return iconMap[icon] || <GiHamburger className={className} />;
};
