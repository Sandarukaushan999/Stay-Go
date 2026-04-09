import api from './axios';

export const getMyNotifications = (page = 1, limit = 20) =>
    api.get(`/notifications/me?page=${page}&limit=${limit}`);
export const markAsRead = (id) => api.patch(`/notifications/${id}/read`);
export const markAllAsRead = () => api.patch('/notifications/read-all');
