import {
  acceptRide,
  cancelRide,
  completeRide,
  getMyRideRequests,
  getNearbyRiders,
  getRideById,
  reportUnsafeBehavior,
  requestRide,
  startRide,
} from '../api/rideApi';

export async function searchNearbyRiders(params) {
  const data = await getNearbyRiders(params);
  return data.riders || [];
}

export async function createRideRequest(payload) {
  const data = await requestRide(payload);
  return data.ride;
}

export async function listMyRideRequests() {
  const data = await getMyRideRequests();
  return data.rides || [];
}

export async function fetchRideById(rideId) {
  return getRideById(rideId);
}

export async function acceptRideRequest(rideId) {
  return acceptRide(rideId);
}

export async function startRideRequest(rideId) {
  return startRide(rideId);
}

export async function completeRideRequest(rideId) {
  return completeRide(rideId);
}

export async function cancelRideRequest(rideId) {
  return cancelRide(rideId);
}

export async function reportRiderUnsafe(rideId) {
  return reportUnsafeBehavior(rideId);
}
