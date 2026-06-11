import { create } from 'zustand';
import { api } from './useAuthStore';

export const usePageStore = create((set, get) => ({
  pages: [],
  activePage: null,
  isLoading: false,

  fetchPages: async (workspaceId) => {
    if (!workspaceId) return;
    set({ isLoading: true });
    try {
      const res = await api.get(`/pages?workspaceId=${workspaceId}`);
      set({ pages: res.data.pages, isLoading: false });
    } catch (err) {
      console.error('Failed to fetch pages');
      set({ isLoading: false });
    }
  },

  createPage: async (title, workspaceId, parentPageId = null) => {
    try {
      const res = await api.post('/pages', { title, workspaceId, parentPageId });
      set((state) => ({ pages: [res.data.page, ...state.pages] }));
      return res.data.page;
    } catch (err) {
      console.error('Failed to create page');
      return null;
    }
  },

  updatePage: async (id, data) => {
    try {
      const res = await api.put(`/pages/${id}`, data);
      set((state) => ({
        pages: state.pages.map((p) => (p._id === id ? res.data.page : p)),
        activePage: state.activePage?._id === id ? res.data.page : state.activePage,
      }));
    } catch (err) {
      console.error('Failed to update page');
    }
  },

  deletePage: async (id) => {
    try {
      await api.delete(`/pages/${id}`);
      set((state) => ({
        pages: state.pages.filter((p) => p._id !== id),
        activePage: state.activePage?._id === id ? null : state.activePage,
      }));
    } catch (err) {
      console.error('Failed to delete page');
    }
  },

  setActivePage: (page) => {
    set({ activePage: page });
  },
}));
