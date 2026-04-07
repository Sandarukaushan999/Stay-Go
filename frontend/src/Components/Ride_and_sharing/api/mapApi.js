import httpClient from './httpClient';

export async function geocodeAddress(query) {
  const { data } = await httpClient.post('/ride-sharing/maps/geocode', { query });
  return data;
}

export async function reverseGeocode(payload) {
  const { data } = await httpClient.post('/ride-sharing/maps/reverse-geocode', payload);
  return data;
}

export async function fetchRoute(payload) {
  const { data } = await httpClient.post('/ride-sharing/maps/route', payload);
  return data;
}
