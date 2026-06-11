import { create } from 'zustand';
import { api } from './useAuthStore';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async (workspaceId) => {
    if (!workspaceId) return;
    set({ isLoading: true });
    try {
      const res = await api.get(`/tasks?workspaceId=${workspaceId}`);
      set({ tasks: res.data.tasks, isLoading: false });
    } catch (err) {
      console.error('Failed to fetch tasks');
      set({ isLoading: false });
    }
  },

  createTask: async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      set((state) => ({ tasks: [res.data.task, ...state.tasks] }));
      return res.data.task;
    } catch (err) {
      console.error('Failed to create task');
      return null;
    }
  },

  updateTask: async (id, data) => {
    try {
      const res = await api.put(`/tasks/${id}`, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? res.data.task : t)),
      }));
    } catch (err) {
      console.error('Failed to update task');
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
      }));
    } catch (err) {
      console.error('Failed to delete task');
    }
  },
}));
