import type { Product, Category } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const productService = {
    /**
     * Récupère toutes les catégories
     */
    getCategories: async (): Promise<Category[]> => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    /**
     * Récupère tous les produits
     */
    getAllProducts: async (): Promise<Product[]> => {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    /**
     * Récupère les produits par catégorie
     * (Filtrage côté client pour l'instant ou via API si implémenté)
     */
    getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
        try {
            const products = await productService.getAllProducts();
            return products.filter(p => p.category === categoryId || p.category === products.find(prod => prod.id === p.id)?.category);
        } catch (error) {
            console.error('Error fetching products by category:', error);
            return [];
        }
    },

    /**
     * Récupère un produit par son ID
     */
    getProductById: async (id: string): Promise<Product | undefined> => {
        try {
            const response = await fetch(`${API_URL}/products/${id}`);
            if (!response.ok) return undefined;
            return await response.json();
        } catch (error) {
            console.error('Error fetching product:', error);
            return undefined;
        }
    }
};

// Override les méthodes pour mapper correctement les données Backend -> Frontend
interface RawProduct {
    categoryName?: string;
    options?: RawOption[];
    categoryId?: string;
    [key: string]: unknown;
}

interface RawOption {
    id: string;
    name: string;
    type: string;
    required: boolean;
    maxQuantity?: number;
    options: unknown[];
}

const originalGetAll = productService.getAllProducts;
productService.getAllProducts = async () => {
    const rawProducts = await originalGetAll();
    // Mapper les champs qui diffèrent
    return rawProducts.map((p: RawProduct) => ({
        ...p,
        category: p.categoryName || 'Inconnu', // Map categoryName -> category
        optionGroups: p.options ? p.options.map((opt: RawOption) => ({
            id: opt.id,
            name: opt.name,
            type: opt.type,
            required: opt.required,
            maxQuantity: opt.maxQuantity,
            options: opt.options // choices
        })) : []
    }));
};

const originalGetById = productService.getProductById;
productService.getProductById = async (id: string) => {
    const p = await originalGetById(id) as RawProduct | undefined;
    if (!p) return undefined;
    return {
        ...p,
        category: p.categoryName || 'Inconnu',
        optionGroups: p.options ? p.options.map((opt: RawOption) => ({
            id: opt.id,
            name: opt.name,
            type: opt.type,
            required: opt.required,
            maxQuantity: opt.maxQuantity,
            options: opt.options
        })) : []
    };
};

productService.getProductsByCategory = async (categoryId: string) => {
    const all = await productService.getAllProducts();
    return all.filter((p: RawProduct) => p.categoryId === categoryId);
};

