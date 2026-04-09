import { useEffect, useState } from 'react';
import { getLiveTrip, joinTripRoom, leaveTripRoom, onTripLocation } from '../services/trackingService';

export default function useLiveLocation(tripId) {
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tripId) return undefined;

    let unsubscribe;

    async function bootstrap() {
      try {
        const liveTrip = await getLiveTrip(tripId);
        setTrip(liveTrip);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    bootstrap();
    joinTripRoom(tripId);

    unsubscribe = onTripLocation((payload) => {
      if (payload.tripId !== tripId) return;
      setTrip((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          currentLocation: {
            lat: payload.lat,
            lng: payload.lng,
            addressText: payload.addressText || '',
            updatedAt: payload.updatedAt,
          },
        };
      });
    });

    return () => {
      leaveTripRoom(tripId);
      unsubscribe?.();
    };
  }, [tripId]);

  return {
    trip,
    error,
    setTrip,
  };
}
