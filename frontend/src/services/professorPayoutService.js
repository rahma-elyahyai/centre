// src/services/professorPayoutService.js
import api from './api';

export const professorPayoutAPI = {
  getAllPayouts: (params = {}) =>
    api.get('/api/professor-payouts', { params }).then(res => res.data),

  getPayout: (id) =>
    api.get(`/api/professor-payouts/${id}`).then(res => res.data),

  createPayout: (data) =>
    api.post('/api/professor-payouts', data).then(res => res.data),

  updatePayout: (id, data) =>
    api.put(`/api/professor-payouts/${id}`, data).then(res => res.data),

  // Ligne déjà enregistrée en base (id réel)
  markAsPaid: (id) =>
    api.patch(`/api/professor-payouts/${id}/mark-paid`).then(res => res.data),

  // Ligne encore "virtuelle" (pas d'id) — crée la ligne du mois courant puis la marque payée
  markAsPaidForProfessor: (professorId, montant) =>
    api.patch(`/api/professor-payouts/professor/${professorId}/mark-paid`, null, { params: { montant } }).then(res => res.data),

  deletePayout: (id) =>
    api.delete(`/api/professor-payouts/${id}`).then(res => res.data),

  getStats: () =>
    api.get('/api/professor-payouts/stats').then(res => res.data),
};

export default professorPayoutAPI;
