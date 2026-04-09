import api from './axios';

export const createOrUpdatePreference = (data) => api.post('/room-preferences/me', data);
export const getMyPreference = () => api.get('/room-preferences/me');
export const updateMyPreference = (data) => api.put('/room-preferences/me', data);
