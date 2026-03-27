import { fetchRoute } from '../api/mapApi';

export async function getTripRoute({ origin, destination }) {
  return fetchRoute({ origin, destination });
}
