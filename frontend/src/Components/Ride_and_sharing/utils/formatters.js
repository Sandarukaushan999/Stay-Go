import dayjs from 'dayjs';

export function formatDateTime(value) {
  if (!value) return '-';
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
}

export function formatDurationSeconds(seconds = 0) {
  const total = Number(seconds || 0);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

export function formatDistanceMeters(meters = 0) {
  const numeric = Number(meters || 0);

  if (numeric >= 1000) {
    return `${(numeric / 1000).toFixed(1)} km`;
  }

  return `${Math.round(numeric)} m`;
}

export function formatStatusLabel(status = '') {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
