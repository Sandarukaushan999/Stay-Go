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

export async function getAdminPassengers() {
  const { data } = await httpClient.get('/admin/passengers');
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

export async function updateAdminUser(userId, payload) {
  const { data } = await httpClient.put(`/admin/users/${userId}`, payload);
  return data;
}

export async function deleteAdminUser(userId) {
  const { data } = await httpClient.delete(`/admin/users/${userId}`);
  return data;
}
