// src/services/paymentService.js
import api from './api';

export const paymentAPI = {
  getAll: () => api.get('/payments').then(r => r.data),
  getAllPayments: async (params = {}) => {
    const { status = '', month = '', search = '' } = params;
    const queryParams = {};
    if (status && status !== 'all') queryParams.status = status;
    if (month  && month  !== 'all') queryParams.month  = month;
    if (search) queryParams.search = search;

    const response = await api.get('/payments', { params: queryParams });
    console.log('[paymentAPI] getAllPayments raw:', response.data);
    return response.data;
    // Attendu: { success: true, data: [...] }
  },

  getStats: async () => {
    const response = await api.get('/payments/stats');
    console.log('[paymentAPI] getStats raw:', response.data);
    return response.data;
  },

  createPayment: async (data) => {
    const response = await api.post('/payments', data);
    return response.data;
  },

  updatePayment: async (id, data) => {
    const response = await api.put(`/payments/${id}`, data);
    return response.data;
  },

  markAsPaid: async (id, paymentMethod) => {
    const response = await api.patch(`/payments/${id}/mark-paid`, null, {
      params: { paymentMethod }
    });
    return response.data;
  },

  deletePayment: async (id) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },
};