import api from './api';

export const profileAPI = {
  getProfile: async () => {
    const res = await api.get('/api/profile');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/api/profile', data);
    return res.data;
  },
  changePassword: async (data) => {
    const res = await api.put('/api/profile/password', data);
    return res.data;
  },
};