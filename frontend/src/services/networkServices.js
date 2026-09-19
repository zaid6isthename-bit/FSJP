import { api } from './api';

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};

export const networkService = {
  getStatus: () => api.get('/network/status'),
  discover: () => api.post('/network/discover'),
};

export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
};

export const activityService = {
  getActivities: (limit = 30) => api.get(`/activity?limit=${limit}`),
};
