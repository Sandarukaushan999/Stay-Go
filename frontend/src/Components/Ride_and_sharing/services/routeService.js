import { fetchRoute } from '../api/mapApi';

const ROUTE_CACHE_TTL_MS = 90 * 1000;
const ROUTE_CACHE_MAX = 150;

const routeCache = new Map();
const inFlightRequests = new Map();

function normalizePoint(point) {
  if (!point || typeof point.lat !== 'number' || typeof point.lng !== 'number') {
    return null;
  }

  return {
    lat: Number(point.lat),
    lng: Number(point.lng),
  };
}

function pointKey(point) {
  const normalized = normalizePoint(point);
  if (!normalized) {
    return 'na';
  }

  return `${normalized.lat.toFixed(5)},${normalized.lng.toFixed(5)}`;
}

function buildRouteKey(origin, destination) {
  return `${pointKey(origin)}->${pointKey(destination)}`;
}

function cloneRouteData(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  return {
    ...data,
    routeGeometry: Array.isArray(data.routeGeometry) ? [...data.routeGeometry] : [],
  };
}

function readCache(key) {
  const cached = routeCache.get(key);
  if (!cached) {
    return null;
  }

  if (Date.now() - cached.savedAt > ROUTE_CACHE_TTL_MS) {
    routeCache.delete(key);
    return null;
  }

  return cloneRouteData(cached.data);
}

function writeCache(key, data) {
  routeCache.set(key, { savedAt: Date.now(), data: cloneRouteData(data) });

  if (routeCache.size <= ROUTE_CACHE_MAX) {
    return;
  }

  const oldestKey = routeCache.keys().next().value;
  if (oldestKey) {
    routeCache.delete(oldestKey);
  }
}

export async function getTripRoute({ origin, destination }) {
  const cacheKey = buildRouteKey(origin, destination);
  const cached = readCache(cacheKey);

  if (cached) {
    return cached;
  }

  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const request = (async () => {
    try {
      const data = await fetchRoute({ origin, destination });
      writeCache(cacheKey, data);
      return cloneRouteData(data);
    } catch (error) {
      // If OSRM is rate-limiting temporarily, return stale cache if available.
      if (error?.response?.status === 429 && routeCache.has(cacheKey)) {
        const stale = routeCache.get(cacheKey);
        return cloneRouteData(stale?.data || null);
      }

      throw error;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, request);
  return request;
}
