export function buildBufferedDeadline({ startedAt, expectedDurationSeconds, bufferMinutes = 15 }) {
  const startMs = new Date(startedAt).getTime();
  const expectedMs = Number(expectedDurationSeconds || 0) * 1000;
  const bufferMs = Number(bufferMinutes || 0) * 60 * 1000;

  return new Date(startMs + expectedMs + bufferMs).toISOString();
}

export function isTripOverdue({ trip, now = Date.now() }) {
  if (!trip || !trip.startedAt || trip.completedAt) {
    return false;
  }

  const deadline = new Date(
    trip.bufferedDeadlineAt ||
      buildBufferedDeadline({
        startedAt: trip.startedAt,
        expectedDurationSeconds: trip.expectedDurationSeconds,
        bufferMinutes: trip.bufferMinutes || 15,
      })
  ).getTime();

  return now > deadline;
}
