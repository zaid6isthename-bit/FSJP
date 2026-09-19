import { api } from './api';

export const fileService = {
  getMyFiles: () => api.get('/files'),
  getFile: (id) => api.get(`/files/${id}`),
  searchFiles: (query = '') => api.get(`/files/search?q=${encodeURIComponent(query)}`),
  shareFile: (formData) => api.post('/files/share', formData),
  pauseSharing: (id) => api.post(`/files/${id}/pause`),
  resumeSharing: (id) => api.post(`/files/${id}/resume`),
  deleteFile: (id) => api.delete(`/files/${id}`),
  getFileContentUrl: (id) => `/api/files/${id}/content`,
};
