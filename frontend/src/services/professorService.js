// src/services/professorService.js
import axiosInstance from './api'; // ou '../api' selon votre structure
// Changez 'api' par 'axiosInstance'

export const professorAPI = {
  // Récupérer tous les professeurs
  getAllProfessors: async (params = {}) => {
    const { specialite = '', search = '' } = params;
    
    const response = await axiosInstance.get('/professors', { // <- Changer ici
      params: {
        specialite: specialite === 'all' ? '' : specialite,
        search
      }
    });
    return response.data;
  },
  
  // Récupérer les statistiques
  getStats: async () => {
    const response = await axiosInstance.get('/professors/stats'); // <- Changer ici
    return response.data;
  },
  
  // Récupérer les spécialités
  getSpecialites: async () => {
    const response = await axiosInstance.get('/professors/options/specialites'); // <- Changer ici
    return response.data;
  },

  
  // Créer un professeur
createProfessor: async (professorData, photoFile) => {
    try {
      const formData = new FormData();
      
      // Ajouter les données JSON
      formData.append('data', new Blob([JSON.stringify(professorData)], {
        type: 'application/json'
      }));
      
      // Ajouter la photo si présente
      if (photoFile) {
        formData.append('photo', photoFile);
      }
      
      const response = await axiosInstance.post('/professors', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error in createProfessor:', error);
      throw error;
    }
  },
  
  // Mettre à jour un professeur avec photo optionnelle
  updateProfessor: async (id, professorData, photoFile) => {
    try {
      const formData = new FormData();
      
      // Ajouter les données JSON
      formData.append('data', new Blob([JSON.stringify(professorData)], {
        type: 'application/json'
      }));
      
      // Ajouter la photo si présente
      if (photoFile) {
        formData.append('photo', photoFile);
      }
      
      const response = await axiosInstance.put(`/professors/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error in updateProfessor:', error);
      throw error;
    }
  },
  
  // Récupérer un professeur par ID
  getProfessor: async (id) => {
    const response = await axiosInstance.get(`/professors/${id}`);
    return response.data;
  },
  
  // Supprimer un professeur
  deleteProfessor: async (id) => {
    const response = await axiosInstance.delete(`/professors/${id}`);
    return response.data;
  }
};