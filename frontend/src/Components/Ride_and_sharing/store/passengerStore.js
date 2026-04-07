import { create } from 'zustand';

export const usePassengerStore = create((set) => ({
  nearbyRiders: [],
  selectedRider: null,
  latestRideRequest: null,

  setNearbyRiders: (nearbyRiders) => set({ nearbyRiders }),
  setSelectedRider: (selectedRider) => set({ selectedRider }),
  setLatestRideRequest: (latestRideRequest) => set({ latestRideRequest }),
}));
