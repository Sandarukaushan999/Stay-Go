import axios from 'axios';
import { getToken } from '../utils/storage';

const httpClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export default httpClient;
