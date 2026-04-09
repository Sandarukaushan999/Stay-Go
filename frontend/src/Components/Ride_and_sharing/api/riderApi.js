import httpClient from './httpClient';

export async function getRiderProfile() {
  const { data } = await httpClient.get('/ride-sharing/profile/me');
  return data;
}

export async function updateRiderProfile(payload) {
  const { data } = await httpClient.put('/ride-sharing/profile/me', payload);
  return data;
}

export async function updateRiderAvailability(payload) {
  const { data } = await httpClient.put('/ride-sharing/profile/me/availability', payload);
  return data;
}
