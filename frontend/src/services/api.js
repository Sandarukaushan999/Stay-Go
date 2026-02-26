import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const roommateService = {
  getProfile: () => api.get('/roommates/profile'),
  updatePreferences: (data) => api.put('/roommates/preferences', data),
  getMatches: () => api.get('/roommates/matches'),
  sendRequest: (id) => api.post(`/roommates/request/${id}`),
  respondToRequest: (id, status) => api.put(`/roommates/request/${id}`, { status }),
};

export const rideService = {
  listRides: () => api.get('/rides'),
  createRide: (data) => api.post('/rides', data),
  requestRide: (id) => api.post(`/rides/${id}/request`),
  updateStatus: (id, status) => api.put(`/rides/${id}/status`, { status }),
};

export const maintenanceService = {
  listTickets: () => api.get('/maintenance'),
  createTicket: (data) => api.post('/maintenance', data),
  updateTicket: (id, data) => api.put(`/maintenance/${id}`, data),
};

export const adminService = {
  listUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  listComplaints: () => api.get('/admin/complaints'),
  updateComplaint: (id, data) => api.put(`/admin/complaints/${id}`, data),
};

export default api;
