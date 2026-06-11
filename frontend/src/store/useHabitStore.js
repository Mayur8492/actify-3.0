import { create } from 'zustand';
import { api } from './useAuthStore';

export const useHabitStore = create((set, get) => ({
  habits: [],
  isLoading: false,
  error: null,

  fetchHabits: async (workspaceId) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/habits?workspaceId=${workspaceId}`);
      set({ habits: res.data.data, isLoading: false, error: null });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch habits', isLoading: false });
    }
  },

  createHabit: async (habitData) => {
    try {
      const res = await api.post('/habits', habitData);
      set((state) => ({ habits: [...state.habits, res.data.data] }));
      return res.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create habit' });
      return null;
    }
  },

  toggleHabitDate: async (id, date) => {
    try {
      const res = await api.post(`/habits/${id}/toggle`, { date });
      set((state) => ({
        habits: state.habits.map((h) => h._id === id ? res.data.data : h)
      }));
    } catch (error) {
      console.error('Toggle error:', error);
    }
  },

  deleteHabit: async (id) => {
    try {
      await api.delete(`/habits/${id}`);
      set((state) => ({
        habits: state.habits.filter((h) => h._id !== id)
      }));
    } catch (error) {
      console.error('Delete error:', error);
    }
  }
}));
