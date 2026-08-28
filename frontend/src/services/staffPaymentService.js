// src/services/staffPaymentService.js
import api from './api';

export const staffPaymentAPI = {
  getAllStaffPayments: (params = {}) =>
    api.get('/api/staff-payments', { params }).then(res => res.data),

  getStaffPayment: (id) =>
    api.get(`/api/staff-payments/${id}`).then(res => res.data),

  createStaffPayment: (data) =>
    api.post('/api/staff-payments', data).then(res => res.data),

  updateStaffPayment: (id, data) =>
    api.put(`/api/staff-payments/${id}`, data).then(res => res.data),

  markAsPaid: (id) =>
    api.patch(`/api/staff-payments/${id}/mark-paid`).then(res => res.data),

  deleteStaffPayment: (id) =>
    api.delete(`/api/staff-payments/${id}`).then(res => res.data),

  getStats: () =>
    api.get('/api/staff-payments/stats').then(res => res.data),
};

export default staffPaymentAPI;
