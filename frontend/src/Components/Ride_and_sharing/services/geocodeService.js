import { geocodeAddress, reverseGeocode } from '../api/mapApi';

export async function searchAddress(query) {
  const data = await geocodeAddress(query);
  return data.data || [];
}

export async function reverseLookupLocation(payload) {
  const data = await reverseGeocode(payload);
  return data.data;
}
