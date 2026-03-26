import { getMe, login, registerPassenger, registerRider } from '../api/authApi';
import { clearAuth, saveAuth } from '../utils/storage';

export async function loginUser(payload) {
  const data = await login(payload);
  saveAuth(data);
  return data;
}

export async function registerRiderUser(payload) {
  const data = await registerRider(payload);
  saveAuth(data);
  return data;
}

export async function registerPassengerUser(payload) {
  const data = await registerPassenger(payload);
  saveAuth(data);
  return data;
}

export async function fetchCurrentUser() {
  const data = await getMe();
  return data.user;
}

export function logoutUser() {
  clearAuth();
}
