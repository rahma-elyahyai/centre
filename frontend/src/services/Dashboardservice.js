// src/services/dashboardService.js
import api from './api';

export const dashboardAPI = {

  // axios retourne { data: { success, message, data } }
  // on unwrap ici pour que le composant reçoive directement { success, data }
  getDashboardData: async () => {
    const response = await api.get('/api/dashboard');
    return response.data; // { success: true, data: { stats, recentStudents, ... } }
  },

  getStats: async () => {
    const response = await api.get('/api/dashboard/stats');
    return response.data;
  },

  getRecentStudents: async () => {
    const response = await api.get('/api/dashboard/recent-students');
    return response.data;
  },

  getRecentActivities: async () => {
    const response = await api.get('/api/dashboard/recent-activities');
    return response.data;
  },

  getUpcomingEvents: async () => {
    const response = await api.get('/api/dashboard/upcoming-events');
    return response.data;
  },
};