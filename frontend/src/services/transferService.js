import { api } from './api';

export const transferService = {
  getAllTransfers: () => api.get('/transfers'),
  getTransfer: (id) => api.get(`/transfers/${id}`),
  downloadFile: (peerId, fileId) => api.post('/transfers/download', { peerId, fileId }),
  cancelTransfer: (id) => api.post(`/transfers/${id}/cancel`),
  retryTransfer: (id) => api.post(`/transfers/${id}/retry`),
  getDownloadedFileUrl: (id) => `/api/transfers/${id}/content`,
};
