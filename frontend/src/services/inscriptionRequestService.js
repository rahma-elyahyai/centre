// src/services/inscriptionRequestService.js
import api from './api';

export const inscriptionRequestAPI = {
  // Public — aucune authentification requise
  submit: (data) =>
    api.post('/api/inscription-requests', data).then(res => res.data),

  // Admin — authentification requise
  getAll: (params = {}) =>
    api.get('/api/inscription-requests', { params }).then(res => res.data),

  getOne: (id) =>
    api.get(`/api/inscription-requests/${id}`).then(res => res.data),

  updateStatut: (id, statut) =>
    api.patch(`/api/inscription-requests/${id}/statut`, null, { params: { statut } }).then(res => res.data),

  updateNotes: (id, notes) =>
    api.patch(`/api/inscription-requests/${id}/notes`, null, { params: { notes } }).then(res => res.data),

  delete: (id) =>
    api.delete(`/api/inscription-requests/${id}`).then(res => res.data),

  getStats: () =>
    api.get('/api/inscription-requests/stats').then(res => res.data),
};

export default inscriptionRequestAPI;
