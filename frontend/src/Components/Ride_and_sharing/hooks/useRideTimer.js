import { useEffect, useMemo, useState } from 'react';

export default function useRideTimer(startedAt) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!startedAt) return undefined;

    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [startedAt]);

  const elapsedSeconds = useMemo(() => {
    if (!startedAt) return 0;
    return Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
  }, [startedAt, now]);

  return {
    elapsedSeconds,
  };
}
