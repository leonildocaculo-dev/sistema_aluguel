import { api } from "./api";

export const favoriteService = {
  async getFavorites() {
    const response = await api.get('/favorites');
    return response.data.data;
  },

  async getFavoriteIds() {
    const response = await api.get('/favorites/ids');
    return response.data.data; // expects array of IDs
  },

  async toggleFavorite(propertyId: number) {
    const response = await api.post(`/favorites/${propertyId}/toggle`);
    return response.data;
  }
};
