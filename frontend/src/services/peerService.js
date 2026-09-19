import { api } from './api';

export const peerService = {
  getPeers: () => api.get('/peers'),
  getPeer: (peerId) => api.get(`/peers/${peerId}`),
  getPeerFiles: (peerId) => api.get(`/peers/${peerId}/files`),
  triggerDiscovery: () => api.post('/peers/discover'),
};
