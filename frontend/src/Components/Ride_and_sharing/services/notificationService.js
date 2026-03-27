import httpClient from '../api/httpClient';

export async function getMyNotifications() {
  const { data } = await httpClient.get('/ride-sharing/notifications');
  return data.notifications || [];
}

export async function markNotificationAsRead(notificationId) {
  const { data } = await httpClient.patch(`/ride-sharing/notifications/${notificationId}/read`);
  return data.notification;
}
