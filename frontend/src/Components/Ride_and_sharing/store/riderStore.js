import { create } from 'zustand';

export const useRiderStore = create((set) => ({
  incomingRequests: [],
  loadingRequests: false,
  activeRide: null,

  setIncomingRequests: (incomingRequests) => set({ incomingRequests }),
  setLoadingRequests: (loadingRequests) => set({ loadingRequests }),
  setActiveRide: (activeRide) => set({ activeRide }),
}));
