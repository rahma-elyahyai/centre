import axios from "axios";

const API_URL = "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 100000,
});

// Intercepteur pour ajouter le token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Intercepteur pour gérer les erreurs de réponse
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide côté serveur
      removeAuthToken();
      window.location.href = "/login?session=expired";
    }

    if (error.response?.status === 403) {
      // Connecté mais pas le bon rôle
      window.location.href = "/unauthorized";
    }

    return Promise.reject(error);
  }
);


// API Functions
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || "Erreur de connexion");
      } else if (error.request) {
        throw new Error("Le serveur ne répond pas. Vérifiez qu'il est démarré sur http://localhost:8080");
      } else {
        throw new Error("Erreur lors de la requête: " + error.message);
      }
    }
  },

  validateToken: async () => {
    try {
      const response = await axiosInstance.post("/auth/validate");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Helper functions
export const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userInfo");
};

export const setUserInfo = (userInfo) => {
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
};

export const getUserInfo = () => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? JSON.parse(userInfo) : null;
};

// Remplace l'actuelle isAuthenticated()
export const isAuthenticated = () => {
  const token = getAuthToken();
  const userInfo = getUserInfo();
  
  if (!token || !userInfo) return false;
  
  // Vérifier l'expiration côté client (sans appel réseau)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      removeAuthToken(); // Nettoie automatiquement
      return false;
    }
  } catch (e) {
    removeAuthToken();
    return false;
  }
  
  return true;
};

export const getUserRole = () => {
  const userInfo = getUserInfo();
  return userInfo?.role || null;
};

export default axiosInstance;