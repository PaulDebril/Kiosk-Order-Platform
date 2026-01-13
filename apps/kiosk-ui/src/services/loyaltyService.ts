const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export interface LoyaltyUser {
  id: string;
  nickName: string;
  fullName: string;
  points: number;
  loyaltyNumber: string;
}

export const loyaltyService = {
  validateCode: async (code: string): Promise<LoyaltyUser | null> => {
    try {
      const response = await fetch(`${API_URL}/loyalty/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur validation code fidélité:', error);
      return null;
    }
  },
};
