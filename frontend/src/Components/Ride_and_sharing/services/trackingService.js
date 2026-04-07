import { io } from 'socket.io-client';
import httpClient from '../api/httpClient';

let socket;

export function getSocketClient() {
  if (!socket) {
    socket = io('/', {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
  }

  return socket;
}

export function joinUserRoom(userId) {
  const client = getSocketClient();
  client.emit('join:user', userId);
}

export function joinTripRoom(tripId) {
  const client = getSocketClient();
  client.emit('join:trip', tripId);
}

export function leaveTripRoom(tripId) {
  const client = getSocketClient();
  client.emit('leave:trip', tripId);
}

export function onTripLocation(handler) {
  const client = getSocketClient();
  client.on('trip:location', handler);

  return () => {
    client.off('trip:location', handler);
  };
}

export function onNewNotification(handler) {
  const client = getSocketClient();
  client.on('notification:new', handler);

  return () => {
    client.off('notification:new', handler);
  };
}

export async function updateTripLocation(tripId, payload) {
  const { data } = await httpClient.post(`/ride-sharing/trips/${tripId}/location-update`, payload);
  return data.trip;
}

export async function getLiveTrip(tripId) {
  const { data } = await httpClient.get(`/ride-sharing/trips/${tripId}/live`);
  return data.trip;
}

export async function getTripById(tripId) {
  const { data } = await httpClient.get(`/ride-sharing/trips/${tripId}`);
  return data.trip;
}

export async function getTripHistory() {
  const { data } = await httpClient.get('/ride-sharing/trips/history');
  return data.trips || [];
}

export async function sendTripSos(tripId, payload = {}) {
  const { data } = await httpClient.post(`/ride-sharing/trips/${tripId}/sos`, payload);
  return data;
}
