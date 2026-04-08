// ============================================
// API SERVICE - handles all backend API calls
// This file is the bridge between frontend and backend
// All fetch calls go through here so we don't repeat code
// Base URL points to our maintenance Express backend on port 5001
// (The team's ride sharing backend uses port 5000)
// ============================================

const API_BASE = 'http://localhost:5001/api';

// ---- HELPER: Get the saved token from localStorage ----
function getToken() {
  return localStorage.getItem('maintenance_token');
}

// ---- HELPER: Save token to localStorage after login ----
function saveToken(token) {
  localStorage.setItem('maintenance_token', token);
}

// ---- HELPER: Save user info to localStorage ----
function saveUser(user) {
  localStorage.setItem('maintenance_user', JSON.stringify(user));
}

// ---- HELPER: Get saved user from localStorage ----
function getUser() {
  const user = localStorage.getItem('maintenance_user');
  return user ? JSON.parse(user) : null;
}

// ---- HELPER: Clear login data (logout) ----
function clearAuth() {
  localStorage.removeItem('maintenance_token');
  localStorage.removeItem('maintenance_user');
}

// ---- HELPER: Make API request with auth token ----
// This function adds the JWT token to every request automatically
async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  // Build headers - always send JSON, add token if available
  const headers = {
    ...options.headers,
  };

  // Only add Content-Type for non-FormData requests
  // FormData sets its own content type with boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Add auth token if we have one
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Make the actual fetch call
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Parse the response as JSON
  const data = await response.json();

  // If response is not OK (400, 401, 500 etc), throw error
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// ============================================
// AUTH API CALLS
// ============================================

// Login and get JWT token
export async function login(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  // Save token and user info for future requests
  saveToken(data.token);
  saveUser(data.user);
  return data;
}

// Get current logged in user
export function getCurrentUser() {
  return getUser();
}

// Logout - clear saved data
export function logout() {
  clearAuth();
}

// Check if user is logged in
export function isLoggedIn() {
  return !!getToken();
}

// Get list of technicians (for admin to assign)
export async function getTechnicians() {
  return apiRequest('/auth/technicians');
}

// ============================================
// TICKET API CALLS
// ============================================

// Student: Create a new ticket
export async function createTicket(formData) {
  // If there are file attachments, use FormData
  if (formData.files && formData.files.length > 0) {
    const form = new FormData();
    form.append('title', formData.title);
    form.append('category', formData.category);
    form.append('priority', formData.priority);
    form.append('hostelBlock', formData.hostelBlock);
    form.append('roomNumber', formData.roomNumber);
    form.append('description', formData.description);
    formData.files.forEach((file) => {
      form.append('attachments', file);
    });
    return apiRequest('/tickets', { method: 'POST', body: form });
  }

  // No files - send as JSON
  return apiRequest('/tickets', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

// Student: Get my tickets
export async function getMyTickets() {
  return apiRequest('/tickets/my');
}

// Technician: Get tickets assigned to me
export async function getAssignedTickets() {
  return apiRequest('/tickets/assigned');
}

// Admin: Get all tickets (with optional filters)
export async function getAllTickets(filters = {}) {
  // Build query string from filters
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);

  const queryString = params.toString();
  const endpoint = queryString ? `/tickets?${queryString}` : '/tickets';

  return apiRequest(endpoint);
}

// Any user: Get single ticket by ID
export async function getTicketById(id) {
  return apiRequest(`/tickets/${id}`);
}

// Admin: Assign technician to ticket
export async function assignTicket(ticketId, technicianId) {
  return apiRequest(`/tickets/${ticketId}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ technicianId }),
  });
}

// Admin: Reject ticket
export async function rejectTicket(ticketId, reason) {
  return apiRequest(`/tickets/${ticketId}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
}

// Technician: Start working on ticket
export async function startTicket(ticketId) {
  return apiRequest(`/tickets/${ticketId}/start`, {
    method: 'PATCH',
  });
}

// Technician: Resolve ticket
export async function resolveTicket(ticketId, resolutionNote) {
  return apiRequest(`/tickets/${ticketId}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify({ resolutionNote }),
  });
}

// Student: Rate and close ticket
export async function rateTicket(ticketId, rating, ratingFeedback) {
  return apiRequest(`/tickets/${ticketId}/rate`, {
    method: 'PATCH',
    body: JSON.stringify({ rating, ratingFeedback }),
  });
}

// Admin: Get analytics data
export async function getAnalytics() {
  return apiRequest('/tickets/analytics');
}

// ============================================
// ANNOUNCEMENT API CALLS
// ============================================

// All users: Get active announcements
export async function getActiveAnnouncements() {
  return apiRequest('/announcements');
}

// Admin: Get all announcements (including hidden)
export async function getAllAnnouncements() {
  return apiRequest('/announcements/all');
}

// Admin: Create announcement
export async function createAnnouncement(data) {
  return apiRequest('/announcements', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Admin: Update announcement
export async function updateAnnouncement(id, data) {
  return apiRequest(`/announcements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Admin: Delete announcement
export async function deleteAnnouncement(id) {
  return apiRequest(`/announcements/${id}`, {
    method: 'DELETE',
  });
}

// Admin: Toggle announcement visibility
export async function toggleAnnouncement(id) {
  return apiRequest(`/announcements/${id}/toggle`, {
    method: 'PATCH',
  });
}
