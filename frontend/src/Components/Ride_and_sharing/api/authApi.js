import httpClient from './httpClient';

export async function registerRider(payload) {
  const { data } = await httpClient.post('/auth/register-rider', payload);
  return data;
}

export async function registerPassenger(payload) {
  const { data } = await httpClient.post('/auth/register-passenger', payload);
  return data;
}

export async function login(payload) {
  const { data } = await httpClient.post('/auth/login', payload);
  return data;
}

export async function getMe() {
  const { data } = await httpClient.get('/auth/me');
  return data;
}
