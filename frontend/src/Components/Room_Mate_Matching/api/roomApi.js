import api from './axios';

export const listRooms = (params = {}) => api.get('/rooms', { params });
export const listAvailableRooms = () => api.get('/rooms/available');
export const createRoom = (data) => api.post('/rooms', data);
export const updateRoom = (id, data) => api.put(`/rooms/${id}`, data);
export const updateRoomStatus = (id, availabilityStatus) => api.patch(`/rooms/${id}/status`, { availabilityStatus });
export const assignStudent = (roomId, studentId) => api.post(`/rooms/${roomId}/assign-student/${studentId}`);
