import api from './axios';

export const createIssue = (formData) =>
    api.post('/issues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
export const getMyIssues = () => api.get('/issues/me');
export const getIssueById = (id) => api.get(`/issues/${id}`);
export const updateIssue = (id, data) => api.patch(`/issues/${id}`, data);
export const updateIssueStatus = (id, status) => api.patch(`/issues/${id}/status`, { status });
export const addAdminComment = (id, adminComment) => api.patch(`/issues/${id}/comment`, { adminComment });
export const getAllIssues = (params = {}) => api.get('/admin/issues', { params });
