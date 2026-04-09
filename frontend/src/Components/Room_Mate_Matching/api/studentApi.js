import api from './axios';

export const createProfile = (data) => api.post('/students/profile', data);
export const getMyProfile = () => api.get('/students/profile/me');
export const updateMyProfile = (data) => api.put('/students/profile/me', data);
export const getStudentById = (id) => api.get(`/students/${id}`);
