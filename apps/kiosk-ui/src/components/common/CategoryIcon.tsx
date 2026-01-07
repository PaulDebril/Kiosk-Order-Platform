import React from 'react';
import {
  GiSushis,
  GiFlatfish,
  GiNoodles,
  GiShrimp,
  GiSodaCan,
  GiIceCreamCone,
  GiMeat,
  GiChopsticks
} from 'react-icons/gi';

interface CategoryIconProps {
  icon: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ icon, className = "w-8 h-8" }) => {
  const iconMap: Record<string, React.ReactElement> = {
    sushi: <GiSushis className={className} />,
    maki: <GiChopsticks className={className} />,
    fish: <GiFlatfish className={className} />,
    ramen: <GiNoodles className={className} />,
    kebab: <GiMeat className={className} />, // Pour Yakitori
    drink: <GiSodaCan className={className} />,
    dessert: <GiIceCreamCone className={className} />,
    shrimp: <GiShrimp className={className} />,
  };

  return iconMap[icon] || <GiSushis className={className} />;
};
