import { products, categories } from '../data/mockData';
import type { Product, Category } from '../types';

// Simuler un délai réseau pour imiter une vraie API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
    /**
     * Récupère toutes les catégories
     */
    getCategories: async (): Promise<Category[]> => {
        await delay(300); // Simulation latence
        console.log('API call: getCategories');
        return categories;
    },

    /**
     * Récupère tous les produits
     */
    getAllProducts: async (): Promise<Product[]> => {
        await delay(500);
        console.log('API call: getAllProducts');
        return products;
    },

    /**
     * Récupère les produits par catégorie
     * @param categoryId L'ID de la catégorie
     */
    getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
        await delay(300);
        const category = categories.find(c => c.id === categoryId);
        if (!category) return [];

        // Note: Dans mockData, les produits sont liés par le nom de la catégorie ('category')
        // et non l'ID. Dans une vraie API, ce serait probablement l'ID.
        return products.filter(p => p.category === category.name);
    },

    /**
     * Récupère un produit par son ID
     */
    getProductById: async (id: string): Promise<Product | undefined> => {
        await delay(200);
        return products.find(p => p.id === id);
    }
};
