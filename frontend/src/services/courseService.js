import api from './api';

export const courseAPI = {
  // Récupérer tous les cours
  getAllCourses: async (params = {}) => {
    try {
      const { level = '', subject = '', professorId, search = '' } = params;
      
      const queryParams = {};
      if (level && level !== 'all') queryParams.level = level;
      if (subject && subject !== 'all') queryParams.subject = subject;
      if (professorId) queryParams.professorId = professorId;
      if (search) queryParams.search = search;
      
      const response = await api.get('/api/courses', { params: queryParams });
      return response.data;
    } catch (error) {
      console.error('Error in getAllCourses:', error);
      throw error;
    }
  },
  
  // Récupérer les statistiques
  getStats: async () => {
    try {
      const response = await api.get('/api/courses/stats');
      return response.data;
    } catch (error) {
      console.error('Error in getStats:', error);
      throw error;
    }
  },
  
  // Récupérer les matières
  getSubjects: async () => {
    try {
      const response = await api.get('/api/courses/options/subjects');
      return response.data;
    } catch (error) {
      console.error('Error in getSubjects:', error);
      throw error;
    }
  },
  
  // Récupérer les niveaux
  getLevels: async () => {
    try {
      const response = await api.get('/api/courses/options/levels');
      return response.data;
    } catch (error) {
      console.error('Error in getLevels:', error);
      throw error;
    }
  },
  
  // Créer un cours
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/api/courses', courseData);
      return response.data;
    } catch (error) {
      console.error('Error in createCourse:', error);
      throw error;
    }
  },
  
  // Mettre à jour un cours
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/api/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error in updateCourse:', error);
      throw error;
    }
  },
  
  // Récupérer un cours par ID
  getCourse: async (id) => {
    try {
      const response = await api.get(`/api/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getCourse:', error);
      throw error;
    }
  },
  
  // Supprimer un cours
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`/api/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in deleteCourse:', error);
      throw error;
    }
  }
};
