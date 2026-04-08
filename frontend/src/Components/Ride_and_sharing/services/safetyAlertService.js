const ALERTS_STORAGE_KEY = 'staygo_safety_alert_feed_v1';
const ALERT_EVENT_NAME = 'staygo:safety-alert';

function canUseBrowserStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function normalizeLevel(level) {
  const value = String(level || 'medium').toLowerCase();

  if (['critical', 'high', 'medium', 'low'].includes(value)) {
    return value;
  }

  return 'medium';
}

function readAlerts() {
  if (!canUseBrowserStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(ALERTS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

function saveAlerts(alerts) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
}

export function listSafetyAlerts() {
  return readAlerts();
}

export function pushSafetyAlert(payload) {
  const alert = {
    id: payload?.id || `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: payload?.title || 'Safety Alert',
    location: payload?.location || 'Campus route',
    level: normalizeLevel(payload?.level),
    time: payload?.time || 'Now',
    message: payload?.message || '',
    type: payload?.type || 'general',
    passengerName: payload?.passengerName || '',
    createdAt: payload?.createdAt || new Date().toISOString(),
  };

  const nextAlerts = [alert, ...readAlerts()].slice(0, 30);
  saveAlerts(nextAlerts);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ALERT_EVENT_NAME, { detail: alert }));
  }

  return alert;
}

export function subscribeSafetyAlerts(handler) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const listener = (event) => {
    handler?.(event?.detail);
  };

  window.addEventListener(ALERT_EVENT_NAME, listener);

  return () => {
    window.removeEventListener(ALERT_EVENT_NAME, listener);
  };
}
