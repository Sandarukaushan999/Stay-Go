import { useEffect } from 'react';

export default function useOverdueTripMonitor({ trip, bufferMinutes = 15, onOverdue }) {
  useEffect(() => {
    if (!trip || trip.status !== 'started') return undefined;

    const timer = setInterval(() => {
      const startedAt = new Date(trip.startedAt).getTime();
      const expectedMs = Number(trip.expectedDurationSeconds || 0) * 1000;
      const bufferMs = Number(bufferMinutes || 0) * 60 * 1000;
      const deadline = startedAt + expectedMs + bufferMs;

      if (Date.now() > deadline && !trip.safetyMessageSent) {
        onOverdue?.(trip);
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [trip, bufferMinutes, onOverdue]);
}
