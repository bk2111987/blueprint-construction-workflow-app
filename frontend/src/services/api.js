import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyTwoFactor: (data) => api.post('/auth/verify-2fa', data),
  setupTwoFactor: () => api.post('/auth/setup-2fa'),
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
  updateLanguage: (language) => api.patch('/auth/language', { language }),
  deleteAccount: () => api.delete('/auth/account')
};

// Project Services
export const projects = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  uploadFile: (id, file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', type);
    return api.post(`/projects/${id}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// Bid Services
export const bids = {
  getAll: (filters) => api.get('/bids', { params: filters }),
  getById: (id) => api.get(`/bids/${id}`),
  create: (data) => api.post('/bids', data),
  update: (id, data) => api.put(`/bids/${id}`, data),
  accept: (id) => api.post(`/bids/${id}/accept`),
  reject: (id) => api.post(`/bids/${id}/reject`)
};

// Material Services
export const materials = {
  getAll: (filters) => api.get('/materials', { params: filters }),
  getById: (id) => api.get(`/materials/${id}`),
  create: (data) => api.post('/materials', data),
  update: (id, data) => api.put(`/materials/${id}`, data),
  updateStock: (id, stockLevel) => api.patch(`/materials/${id}/stock`, { stockLevel }),
  delete: (id) => api.delete(`/materials/${id}`),
  bulkUpdateStock: (updates) => api.post('/materials/bulk-update-stock', { updates })
};

// Task Services
export const tasks = {
  getAll: (filters) => api.get('/tasks', { params: filters }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  updateProgress: (id, progress) => api.patch(`/tasks/${id}/progress`, { progress }),
  addAttachments: (id, files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('attachments', file));
    return api.post(`/tasks/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// Message Services
export const messages = {
  getAll: (filters) => api.get('/messages', { params: filters }),
  send: (data, attachment) => {
    if (attachment) {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      formData.append('attachment', attachment);
      return api.post('/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post('/messages', data);
  },
  getUnreadCount: () => api.get('/messages/unread'),
  markAsRead: (messageIds) => api.post('/messages/read', { messageIds }),
  getConversations: () => api.get('/messages/conversations')
};

export default api;
