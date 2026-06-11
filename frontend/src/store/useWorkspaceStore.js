import { create } from 'zustand';
import { api } from './useAuthStore';

export const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  activeWorkspace: null,
  isLoading: false,

  fetchWorkspaces: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/workspaces');
      set({ workspaces: res.data.workspaces, isLoading: false });
      if (res.data.workspaces.length > 0 && !get().activeWorkspace) {
        set({ activeWorkspace: res.data.workspaces[0] });
      }
    } catch (err) {
      console.error('Failed to fetch workspaces');
      set({ isLoading: false });
    }
  },

  createWorkspace: async (name, isPublic = false) => {
    try {
      const res = await api.post('/workspaces', { name, isPublic });
      set((state) => ({
        workspaces: [...state.workspaces, res.data.workspace],
        activeWorkspace: res.data.workspace,
      }));
      return true;
    } catch (err) {
      console.error('Failed to create workspace');
      return false;
    }
  },

  deleteWorkspace: async (id) => {
    try {
      await api.delete(`/workspaces/${id}`);
      set((state) => {
        const newWorkspaces = state.workspaces.filter(ws => ws._id !== id);
        return {
          workspaces: newWorkspaces,
          activeWorkspace: state.activeWorkspace?._id === id 
            ? (newWorkspaces.length > 0 ? newWorkspaces[0] : null) 
            : state.activeWorkspace
        };
      });
      return true;
    } catch (err) {
      console.error('Failed to delete workspace', err);
      return false;
    }
  },

  setActiveWorkspace: (workspace) => {
    set({ activeWorkspace: workspace });
  },
}));
