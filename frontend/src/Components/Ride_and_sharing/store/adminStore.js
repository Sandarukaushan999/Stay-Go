import { create } from 'zustand';

export const useAdminStore = create((set) => ({
  stats: null,
  users: [],
  trips: [],
  incidents: [],
  riders: [],

  setStats: (stats) => set({ stats }),
  setUsers: (users) => set({ users }),
  setTrips: (trips) => set({ trips }),
  setIncidents: (incidents) => set({ incidents }),
  setRiders: (riders) => set({ riders }),
}));
