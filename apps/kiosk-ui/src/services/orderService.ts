import type { Order, CartItem, OrderType } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
    /**
     * Crée une nouvelle commande
     */
    createOrder: async (items: CartItem[], total: number, type: OrderType = 'dine-in'): Promise<Order> => {
        await delay(800);

        // Simulation de la création côté serveur
        const newOrder: Order = {
            id: Math.random().toString(36).substr(2, 9),
            items,
            total,
            timestamp: new Date(),
            orderNumber: Math.floor(1000 + Math.random() * 9000).toString(),
            type,
        };

        // Pour le debug
        console.log('API call: createOrder', newOrder);

        return newOrder;
    },

    /**
     * Récupère l'historique des commandes (optionnel, pour futur usage)
     */
    getOrders: async (): Promise<Order[]> => {
        await delay(500);
        return []; // Mock vide pour l'instant
    }
};
