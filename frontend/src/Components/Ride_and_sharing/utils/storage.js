const AUTH_KEY = 'staygo_auth';

export function saveAuth(data) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function loadAuth() {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function getToken() {
  const auth = loadAuth();
  return auth?.token || null;
}
