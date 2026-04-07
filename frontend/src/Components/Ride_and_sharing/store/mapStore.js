import { create } from 'zustand';

export const useMapStore = create((set) => ({
  origin: null,
  destination: null,
  routeGeometry: [],
  routeMeta: null,

  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  setRouteGeometry: (routeGeometry) => set({ routeGeometry }),
  setRouteMeta: (routeMeta) => set({ routeMeta }),
  resetMap: () => set({ origin: null, destination: null, routeGeometry: [], routeMeta: null }),
}));
