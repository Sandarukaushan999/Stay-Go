import api from './axios';

export const getSuggestions = () => api.get('/matching/suggestions');
export const sendRequest = (receiverStudentId) => api.post(`/matching/requests/${receiverStudentId}`);
export const getSentRequests = () => api.get('/matching/requests/sent');
export const getReceivedRequests = () => api.get('/matching/requests/received');
export const acceptRequest = (requestId) => api.patch(`/matching/requests/${requestId}/accept`);
export const rejectRequest = (requestId) => api.patch(`/matching/requests/${requestId}/reject`);
export const cancelRequest = (requestId) => api.patch(`/matching/requests/${requestId}/cancel`);
export const getMyPair = () => api.get('/matching/pair/me');
