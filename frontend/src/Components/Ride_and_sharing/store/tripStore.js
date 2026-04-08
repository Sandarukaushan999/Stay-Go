import { create } from 'zustand';

export const useTripStore = create((set) => ({
  rides: [],
  activeTrip: null,
  tripHistory: [],

  setRides: (rides) => set({ rides }),
  setActiveTrip: (activeTrip) => set({ activeTrip }),
  setTripHistory: (tripHistory) => set({ tripHistory }),
}));
