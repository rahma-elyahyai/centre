import api from './api';

export const eventAPI = {
  getAllEvents: async (params = {}) => {
    const { status = '', type = '', search = '' } = params;
    const q = {};
    if (status && status !== 'all') q.status = status;
    if (type && type !== 'all') q.type = type;
    if (search) q.search = search;
    const res = await api.get('/events', { params: q });
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/events/stats');
    return res.data;
  },
  createEvent: async (data) => {
    const res = await api.post('/events', data);
    return res.data;
  },
  updateEvent: async (id, data) => {
    const res = await api.put(`/events/${id}`, data);
    return res.data;
  },
  deleteEvent: async (id) => {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  }
};