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
let initializeRequest = null;

export const useAuthStore = create((set, get) => ({
  token: cachedAuth?.token || null,
  user: cachedAuth?.user || null,
  isLoading: false,
  hasInitialized: false,
  error: null,

  setAuth: (payload) =>
    set({
      token: payload.token,
      user: payload.user,
      hasInitialized: true,
      error: null,
    }),

  initialize: async ({ force = false } = {}) => {
    if (get().hasInitialized && !force) {
      return;
    }

    if (initializeRequest && !force) {
      return initializeRequest;
    }

    const token = get().token;

    if (!token) {
      set({ hasInitialized: true, isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });

    initializeRequest = (async () => {
      try {
        const user = await fetchCurrentUser();
        set({ user, isLoading: false, hasInitialized: true, error: null });
      } catch (error) {
        logoutUser();
        set({
          token: null,
          user: null,
          isLoading: false,
          hasInitialized: true,
          error: error.message,
        });
      } finally {
        initializeRequest = null;
      }
    })();

    return initializeRequest;
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginUser(payload);
      set({
        token: data.token,
        user: data.user,
        isLoading: false,
        hasInitialized: true,
      });
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
      set({
        token: data.token,
        user: data.user,
        isLoading: false,
        hasInitialized: true,
      });
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
      set({
        token: data.token,
        user: data.user,
        isLoading: false,
        hasInitialized: true,
      });
      return data.user;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  logout: () => {
    logoutUser();
    set({
      token: null,
      user: null,
      error: null,
      isLoading: false,
      hasInitialized: true,
    });
  },
}));
