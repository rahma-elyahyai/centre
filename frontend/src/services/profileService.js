import api from './api';

export const profileAPI = {
  getProfile: async () => {
    const res = await api.get('/profile');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/profile', data);
    return res.data;
  },
  changePassword: async (data) => {
    const res = await api.put('/profile/password', data);
    return res.data;
  },
};