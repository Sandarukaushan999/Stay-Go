import { useCallback, useState } from 'react';
import { getTripRoute } from '../services/routeService';
import { useMapStore } from '../store/mapStore';

export default function useMapRoute() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setRouteGeometry = useMapStore((state) => state.setRouteGeometry);
  const setRouteMeta = useMapStore((state) => state.setRouteMeta);

  const calculateRoute = useCallback(async ({ origin, destination }) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTripRoute({ origin, destination });
      setRouteGeometry(data.routeGeometry || []);
      setRouteMeta({
        distanceMeters: data.distanceMeters || 0,
        expectedDurationSeconds: data.expectedDurationSeconds || 0,
      });
      return data;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, [setRouteGeometry, setRouteMeta]);

  return {
    calculateRoute,
    loading,
    error,
  };
}
