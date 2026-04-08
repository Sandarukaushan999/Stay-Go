import httpClient from './httpClient';

export async function getAdminDashboard() {
  const { data } = await httpClient.get('/admin/dashboard');
  return data;
}

export async function getAdminUsers() {
  const { data } = await httpClient.get('/admin/users');
  return data;
}

export async function getAdminRiders() {
  const { data } = await httpClient.get('/admin/riders');
  return data;
}

export async function getAdminTrips() {
  const { data } = await httpClient.get('/admin/trips');
  return data;
}

export async function getAdminIncidents() {
  const { data } = await httpClient.get('/admin/incidents');
  return data;
}

export async function approveRider(riderId) {
  const { data } = await httpClient.patch(`/admin/riders/${riderId}/approve`);
  return data;
}

export async function blockUser(userId, block = true) {
  const { data } = await httpClient.patch(`/admin/users/${userId}/block`, { block });
  return data;
}
