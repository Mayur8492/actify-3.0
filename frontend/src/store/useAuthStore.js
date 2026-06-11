import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('actify_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('actify_token') || null,
  isLoading: false,
  error: null,

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      localStorage.setItem('actify_token', res.data.token);
      set({ user: res.data.user, token: res.data.token, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Signup failed', isLoading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('actify_token', res.data.token);
      set({ user: res.data.user, token: res.data.token, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', isLoading: false });
      return false;
    }
  },

  loginAsDemo: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/demo');
      localStorage.setItem('actify_token', res.data.token);
      set({ user: res.data.user, token: res.data.token, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Demo initialization failed', isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('actify_token');
    set({ user: null, token: null });
  },

  fetchProfile: async () => {
    const token = localStorage.getItem('actify_token');
    if (!token) return;
    set({ isLoading: true });
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.user, isLoading: false });
    } catch (err) {
      localStorage.removeItem('actify_token');
      set({ user: null, token: null, isLoading: false });
    }
  },

  updateProfile: async (name, email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put('/auth/profile', { name, email });
      set({ user: res.data.user, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to update profile', isLoading: false });
      return false;
    }
  },
}));

export { useAuthStore, api };
