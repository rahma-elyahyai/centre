// src/services/equipmentService.js
import api from './api';

export const equipmentAPI = {
  getAllEquipment: (params = {}) =>
    api.get('/api/equipment', { params }).then(res => res.data),

  getEquipment: (id) =>
    api.get(`/api/equipment/${id}`).then(res => res.data),

  createEquipment: (data) =>
    api.post('/api/equipment', data).then(res => res.data),

  updateEquipment: (id, data) =>
    api.put(`/api/equipment/${id}`, data).then(res => res.data),

  deleteEquipment: (id) =>
    api.delete(`/api/equipment/${id}`).then(res => res.data),

  getStats: () =>
    api.get('/api/equipment/stats').then(res => res.data),

  getCategories: () =>
    api.get('/api/equipment/options/categories').then(res => res.data),
};

export default equipmentAPI;
