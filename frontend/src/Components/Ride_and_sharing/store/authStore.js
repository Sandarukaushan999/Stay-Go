import { create } from 'zustand';
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerPassengerUser,
  registerRiderUser,
} from '../services/authService';
import { loadAuth } from '../utils/storage';

const cachedAuth = loadAuth();

export const useAuthStore = create((set, get) => ({
  token: cachedAuth?.token || null,
  user: cachedAuth?.user || null,
  isLoading: false,
  error: null,

  setAuth: (payload) => set({ token: payload.token, user: payload.user, error: null }),

  initialize: async () => {
    if (!get().token) return;

    set({ isLoading: true });
    try {
      const user = await fetchCurrentUser();
      set({ user, isLoading: false });
    } catch (error) {
      logoutUser();
      set({ token: null, user: null, isLoading: false, error: error.message });
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginUser(payload);
      set({ token: data.token, user: data.user, isLoading: false });
      return data.user;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  registerRider: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await registerRiderUser(payload);
      set({ token: data.token, user: data.user, isLoading: false });
      return data.user;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  registerPassenger: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await registerPassengerUser(payload);
      set({ token: data.token, user: data.user, isLoading: false });
      return data.user;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  logout: () => {
    logoutUser();
    set({ token: null, user: null, error: null, isLoading: false });
  },
}));
