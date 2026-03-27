import { getMe, login, registerPassenger, registerRider } from '../api/authApi';
import { clearAuth, loadAuth, saveAuth } from '../utils/storage';
import { fetchLocalCurrentUser, isLocalToken, loginLocalUser, registerLocalUser } from './localAuthService';

function shouldFallbackToLocal(error) {
  const message = String(error?.message || '').toLowerCase();
  const status = Number(error?.response?.status || 0);
  const code = String(error?.code || '').toLowerCase();

  if (!status && (code === 'err_network' || code === 'econnrefused' || code === 'enotfound')) {
    return true;
  }

  if (!status && error?.request) {
    return true;
  }

  return (
    message.includes('network error') ||
    message.includes('failed to fetch') ||
    message.includes('timeout') ||
    message.includes('status code 404') ||
    message.includes('status code 502') ||
    message.includes('status code 503') ||
    message.includes('status code 504') ||
    status === 404 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

export async function loginUser(payload) {
  try {
    const data = await login(payload);
    saveAuth(data);
    return data;
  } catch (remoteError) {
    try {
      const data = await loginLocalUser(payload);
      saveAuth(data);
      return data;
    } catch (localError) {
      if (shouldFallbackToLocal(remoteError)) {
        throw localError;
      }

      throw remoteError;
    }
  }
}

export async function registerRiderUser(payload) {
  try {
    const data = await registerRider(payload);
    saveAuth(data);
    return data;
  } catch (remoteError) {
    if (!shouldFallbackToLocal(remoteError)) {
      throw remoteError;
    }

    const data = await registerLocalUser('rider', payload);
    saveAuth(data);
    return data;
  }
}

export async function registerPassengerUser(payload) {
  try {
    const data = await registerPassenger(payload);
    saveAuth(data);
    return data;
  } catch (remoteError) {
    if (!shouldFallbackToLocal(remoteError)) {
      throw remoteError;
    }

    const data = await registerLocalUser('passenger', payload);
    saveAuth(data);
    return data;
  }
}

export async function fetchCurrentUser() {
  const auth = loadAuth();

  try {
    const data = await getMe();
    return data.user;
  } catch (remoteError) {
    const token = auth?.token;

    if (isLocalToken(token)) {
      return fetchLocalCurrentUser(token);
    }

    if (shouldFallbackToLocal(remoteError) && auth?.user) {
      return auth.user;
    }

    throw remoteError;
  }
}

export function logoutUser() {
  clearAuth();
}