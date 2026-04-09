import httpClient from './httpClient';

export async function getPassengerProfile() {
  const { data } = await httpClient.get('/ride-sharing/profile/me');
  return data;
}

export async function updatePassengerProfile(payload) {
  const { data } = await httpClient.put('/ride-sharing/profile/me', payload);
  return data;
}
