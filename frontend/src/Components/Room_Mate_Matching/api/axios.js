import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach dev identity headers from localStorage on every request
api.interceptors.request.use((config) => {
    const studentId = localStorage.getItem('dev_student_id');
    const role = localStorage.getItem('dev_role') || 'student';
    if (studentId) config.headers['x-student-id'] = studentId;
    config.headers['x-role'] = role;
    return config;
});

export default api;
