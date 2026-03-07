// src/services/studentService.js
import api from './api';

export const studentAPI = {
  /**
   * Récupérer tous les étudiants avec pagination et filtres
   */
  getAllStudents: async (params = {}) => {
    try {
      const {
        niveau = '',
        filiere = '',
        search = '',
        page = 0,
        size = 20,
        sortBy = 'createdAt',
        sortDir = 'desc'
      } = params;
      
      const response = await api.get('/api/students', {
        params: {
          niveau: niveau === 'all' || !niveau ? '' : niveau,
          filiere: filiere === 'all' || !filiere ? '' : filiere,
          search: search || '',
          page,
          size,
          sortBy,
          sortDir
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },
  
  /**
   * Récupérer les statistiques globales
   */
  getStats: async () => {
    try {
      const response = await api.get('/api/students/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },
  
  /**
   * Récupérer tous les niveaux disponibles
   */
  getNiveaux: async () => {
    try {
      const response = await api.get('/api/students/options/niveaux');
      return response.data;
    } catch (error) {
      console.error('Error fetching niveaux:', error);
      throw error;
    }
  },
  
  /**
   * Récupérer toutes les filières disponibles
   */
  getFilieres: async () => {
    try {
      const response = await api.get('/api/students/options/filieres');
      return response.data;
    } catch (error) {
      console.error('Error fetching filieres:', error);
      throw error;
    }
  },
  
  /**
   * Créer un nouvel étudiant
   */
  createStudent: async (studentData) => {
    try {
      const response = await api.post('/api/students', studentData);
      return response.data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },
  
  /**
   * Mettre à jour un étudiant existant
   */
  updateStudent: async (id, studentData) => {
    try {
      const response = await api.put(`/api/students/${id}`, studentData);
      return response.data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },
  
  /**
   * Récupérer un étudiant par son ID
   */
  getStudent: async (id) => {
    try {
      const response = await api.get(`/api/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  },
  
  /**
   * Supprimer un étudiant
   */
  deleteStudent: async (id) => {
    try {
      const response = await api.delete(`/api/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },
  
  /**
   * Récupérer les étudiants par groupe (niveau et filière)
   */
  getStudentsByGroup: async (niveau, filiere) => {
    try {
      const response = await api.get(`/api/students/group/${niveau}/${filiere}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching students by group:', error);
      throw error;
    }
  }
};

export default studentAPI;