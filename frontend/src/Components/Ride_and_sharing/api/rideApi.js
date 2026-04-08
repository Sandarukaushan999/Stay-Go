import httpClient from './httpClient';

export async function requestRide(payload) {
  const { data } = await httpClient.post('/ride-sharing/rides/request', payload);
  return data;
}

export async function getNearbyRiders(params = {}) {
  const { data } = await httpClient.get('/ride-sharing/rides/nearby-riders', { params });
  return data;
}

export async function getMyRideRequests() {
  const { data } = await httpClient.get('/ride-sharing/rides/my-requests');
  return data;
}

export async function getRideById(rideId) {
  const { data } = await httpClient.get(`/ride-sharing/rides/${rideId}`);
  return data;
}

export async function acceptRide(rideId) {
  const { data } = await httpClient.post(`/ride-sharing/rides/${rideId}/accept`);
  return data;
}

export async function startRide(rideId) {
  const { data } = await httpClient.post(`/ride-sharing/rides/${rideId}/start`);
  return data;
}

export async function completeRide(rideId) {
  const { data } = await httpClient.post(`/ride-sharing/rides/${rideId}/complete`);
  return data;
}

export async function cancelRide(rideId) {
  const { data } = await httpClient.post(`/ride-sharing/rides/${rideId}/cancel`);
  return data;
}

export async function reportUnsafeBehavior(rideId) {
  const { data } = await httpClient.post(`/ride-sharing/rides/${rideId}/report-unsafe`);
  return data;
}
