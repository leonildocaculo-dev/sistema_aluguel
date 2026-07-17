import { create } from 'zustand';
import { favoriteService } from '../services/favoriteService';

interface FavoriteState {
  favoriteIds: number[];
  isLoading: boolean;
  isInitialized: boolean;
  initializeFavorites: () => Promise<void>;
  toggleFavorite: (propertyId: number) => Promise<void>;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favoriteIds: [],
  isLoading: false,
  isInitialized: false,

  initializeFavorites: async () => {
    if (get().isInitialized) return;
    
    set({ isLoading: true });
    try {
      const ids = await favoriteService.getFavoriteIds();
      set({ favoriteIds: ids, isInitialized: true });
    } catch (error) {
      console.error('Failed to initialize favorites:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (propertyId: number) => {
    const { favoriteIds } = get();
    const isCurrentlyFavorited = favoriteIds.includes(propertyId);
    
    // Optimistic update
    if (isCurrentlyFavorited) {
      set({ favoriteIds: favoriteIds.filter(id => id !== propertyId) });
    } else {
      set({ favoriteIds: [...favoriteIds, propertyId] });
    }

    try {
      await favoriteService.toggleFavorite(propertyId);
    } catch (error) {
      console.error('Failed to toggle favorite on server:', error);
      // Revert on error
      set({ favoriteIds });
    }
  },

  clearFavorites: () => {
    set({ favoriteIds: [], isInitialized: false });
  }
}));
