import { getMe, login, registerPassenger, registerRider } from '../api/authApi';
import { clearAuth, loadAuth, saveAuth } from '../utils/storage';

const LEGACY_LOCAL_TOKEN_PREFIX = 'staygo-local-token-';

function isLegacyLocalToken(token) {
  return String(token || '').startsWith(LEGACY_LOCAL_TOKEN_PREFIX);
}

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
  const auth = loadAuth();
  const token = auth?.token;

  if (!token) {
    throw new Error('Session not found');
  }

  if (isLegacyLocalToken(token)) {
    clearAuth();
    throw new Error('Session expired. Please sign in again.');
  }

  const data = await getMe();
  return data.user;
}

export function logoutUser() {
  clearAuth();
}

