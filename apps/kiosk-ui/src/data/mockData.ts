import type { Product } from '../types';
import type { Category } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Sushi', icon: 'sushi' },
  { id: '2', name: 'Maki', icon: 'maki' },
  { id: '3', name: 'Sashimi', icon: 'fish' },
  { id: '4', name: 'Ramen & Plats', icon: 'ramen' },
  { id: '5', name: 'Yakitori', icon: 'kebab' },
  { id: '6', name: 'Boissons', icon: 'drink' },
  { id: '7', name: 'Desserts', icon: 'dessert' },
];

export const products: Product[] = [
  // Sushi
  {
    id: '1',
    name: 'Sushi Saumon',
    description: 'Riz vinaigré, tranche de saumon frais premium',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
    category: 'Sushi',
    calories: 140,
    popular: true,
    ingredients: ['Riz vinaigré', 'Saumon Label Rouge', 'Wasabi'],
    optionGroups: [
      {
        id: 'sauces',
        name: 'Sauces & Accompagnements',
        type: 'multiple',
        required: false,
        maxQuantity: 2,
        options: [
          { id: 'wasabi_extra', name: 'Wasabi Extra', price: 0 },
          { id: 'ginger_extra', name: 'Gingembre Extra', price: 0 },
          { id: 'sauce_sucree', name: 'Sauce Soja Sucrée', price: 0.50 },
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Sushi Thon',
    description: 'Riz vinaigré, tranche de thon rouge frais',
    price: 5.00,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    category: 'Sushi',
    calories: 130,
    ingredients: ['Riz vinaigré', 'Thon Rouge', 'Wasabi'],
    optionGroups: [
      {
        id: 'sauces',
        name: 'Sauces & Accompagnements',
        type: 'multiple',
        required: false,
        maxQuantity: 2,
        options: [
          { id: 'wasabi_extra', name: 'Wasabi Extra', price: 0 },
          { id: 'ginger_extra', name: 'Gingembre Extra', price: 0 },
          { id: 'sauce_sucree', name: 'Sauce Soja Sucrée', price: 0.50 },
          { id: 'sauce_salee', name: 'Sauce Soja Salée', price: 0.50 },
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Sushi Crevette',
    description: 'Riz vinaigré, crevette cuite papillon',
    price: 4.80,
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop',
    category: 'Sushi',
    calories: 120,
    optionGroups: [
      {
        id: 'sauces',
        name: 'Sauces & Accompagnements',
        type: 'multiple',
        required: false,
        options: [
          { id: 'wasabi_extra', name: 'Wasabi Extra', price: 0 },
          { id: 'ginger_extra', name: 'Gingembre Extra', price: 0 },
        ]
      }
    ]
  },

  // Maki
  {
    id: '4',
    name: 'Maki Avocat',
    description: 'Rouleau d\'algue, riz, avocat frais',
    price: 3.90,
    image: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=400&h=300&fit=crop',
    category: 'Maki',
    calories: 180,
    popular: true,
    ingredients: ['Riz', 'Algue Nori', 'Avocat'],
  },
  {
    id: '5',
    name: 'California Saumon',
    description: 'Saumon, avocat, sésame, riz à l\'extérieur',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1625244695851-1fc873f942bc?w=400&h=300&fit=crop',
    category: 'Maki',
    calories: 250,
    ingredients: ['Riz', 'Saumon', 'Avocat', 'Sésame'],
    optionGroups: [
      {
        id: 'extras',
        name: 'Suppléments',
        type: 'multiple',
        required: false,
        options: [
          { id: 'cheese', name: 'Cream Cheese', price: 1.00 },
          { id: 'fried_onions', name: 'Oignons Frits', price: 0.50 },
        ]
      }
    ]
  },
  {
    id: '6',
    name: 'Dragon Roll',
    description: 'Tempura de crevette, avocat, anguille, sauce unagi',
    price: 12.90,
    image: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=400&h=300&fit=crop',
    category: 'Maki',
    calories: 450,
    popular: true,
    ingredients: ['Tempura crevette', 'Avocat', 'Anguille', 'Sauce Unagi', 'Sésame'],
  },

  // Sashimi
  {
    id: '7',
    name: 'Sashimi Saumon (6 pcs)',
    description: 'Fines tranches de saumon norvégien frais',
    price: 8.90,
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=300&fit=crop',
    category: 'Sashimi',
    calories: 220,
    optionGroups: [
      {
        id: 'rice',
        name: 'Accompagnement',
        type: 'single',
        required: true,
        options: [
          { id: 'no_rice', name: 'Sans riz', price: 0 },
          { id: 'plain_rice', name: 'Bol de riz nature', price: 2.50 },
          { id: 'vinegar_rice', name: 'Bol de riz vinaigré', price: 3.00 },
        ]
      }
    ]
  },
  {
    id: '8',
    name: 'Sashimi Thon (6 pcs)',
    description: 'Fines tranches de thon rouge',
    price: 9.90,
    image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&h=300&fit=crop',
    category: 'Sashimi',
    calories: 200,
    optionGroups: [
      {
        id: 'rice',
        name: 'Accompagnement',
        type: 'single',
        required: true,
        options: [
          { id: 'no_rice', name: 'Sans riz', price: 0 },
          { id: 'plain_rice', name: 'Bol de riz nature', price: 2.50 },
          { id: 'vinegar_rice', name: 'Bol de riz vinaigré', price: 3.00 },
        ]
      }
    ]
  },

  // Ramen & Plats
  {
    id: '9',
    name: 'Ramen Tonkotsu',
    description: 'Bouillon d\'os de porc riche, nouilles, chashu, oeuf mariné',
    price: 13.90,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    category: 'Ramen & Plats',
    calories: 600,
    popular: true,
    ingredients: ['Bouillon Tonkotsu', 'Nouilles de blé', 'Chashu (Porc)', 'Oeuf Ajitsuke', 'Naruto', 'Nori'],
    optionGroups: [
      {
        id: 'spicy',
        name: 'Niveau d\'épices',
        type: 'single',
        required: true,
        options: [
          { id: 'spicy_0', name: 'Non épicé', price: 0 },
          { id: 'spicy_1', name: 'Légèrement épicé', price: 0 },
          { id: 'spicy_2', name: 'Épicé', price: 0 },
          { id: 'spicy_3', name: 'Très épicé (Feu)', price: 0.50 },
        ]
      },
      {
        id: 'extras',
        name: 'Suppléments Garnier',
        type: 'multiple',
        required: false,
        options: [
          { id: 'egg_extra', name: 'Oeuf Mariné', price: 1.50 },
          { id: 'chashu_extra', name: 'Tranches de Porc', price: 3.00 },
          { id: 'nori_extra', name: 'Algue Nori', price: 0.50 },
          { id: 'noodles_extra', name: 'Supplément Nouilles', price: 2.50 },
        ]
      }
    ]
  },
  {
    id: '10',
    name: 'Bœuf Gyu Don',
    description: 'Bol de riz surmonté de bœuf mijoté et oignons',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    category: 'Ramen & Plats',
    calories: 750,
    ingredients: ['Riz', 'Boeuf émincé', 'Oignons', 'Sauce soja sucrée', 'Oeuf parfait'],
    optionGroups: [
      {
        id: 'size',
        name: 'Taille du bol',
        type: 'single',
        required: true,
        options: [
          { id: 'size_normal', name: 'Normal', price: 0 },
          { id: 'size_large', name: 'Grand (+30% de viande)', price: 4.00 },
        ]
      }
    ]
  },

  // Yakitori
  {
    id: '11',
    name: 'Yakitori Poulet (2 pcs)',
    description: 'Brochettes de poulet grillé sauce teriyaki',
    price: 4.90,
    image: 'https://images.unsplash.com/photo-1610450949437-847321c172b9?w=400&h=300&fit=crop',
    category: 'Yakitori',
    calories: 280,
  },
  {
    id: '12',
    name: 'Yakitori Bœuf Fromage (2 pcs)',
    description: 'Brochettes de bœuf enroulé autour de fromage fondant',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d580690dd0?w=400&h=300&fit=crop',
    category: 'Yakitori',
    calories: 320,
    popular: true,
  },

  // Boissons
  {
    id: '13',
    name: 'Thé Vert Matcha Glacé',
    description: 'Thé vert japonais traditionnel servi glacé',
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1515810237190-7d72111894d8?w=400&h=300&fit=crop',
    category: 'Boissons',
    calories: 80,
  },
  {
    id: '14',
    name: 'Soda Ramune',
    description: 'Limonade japonaise pétillante',
    price: 3.90,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
    category: 'Boissons',
    calories: 90,
  },

  // Desserts
  {
    id: '15',
    name: 'Mochi Glacé (2 pcs)',
    description: 'Pâte de riz gluant fourrée à la glace (Vanille / Mangue)',
    price: 4.90,
    image: 'https://images.unsplash.com/photo-1579306093888-251f2f01f465?w=400&h=300&fit=crop',
    category: 'Desserts',
    calories: 220,
    popular: true,
    optionGroups: [
      {
        id: 'flavors',
        name: 'Parfums',
        type: 'multiple',
        required: true,
        maxQuantity: 2,
        options: [
          { id: 'vanilla', name: 'Vanille', price: 0 },
          { id: 'mango', name: 'Mangue', price: 0 },
          { id: 'matcha', name: 'Matcha', price: 0 },
          { id: 'black_sesame', name: 'Sésame Noir', price: 0 },
        ]
      }
    ]
  },
  {
    id: '16',
    name: 'Dorayaki',
    description: 'Pancakes japonais fourrés à la pâte de haricot rouge',
    price: 3.90,
    image: 'https://images.unsplash.com/photo-1596450849206-ca7b65349e5d?w=400&h=300&fit=crop',
    category: 'Desserts',
    calories: 280,
  },
];
