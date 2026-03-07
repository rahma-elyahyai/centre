import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://centre-backend.onrender.com";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 100000000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      window.location.href = "/login?session=expired";
    }

    if (error.response?.status === 403) {
      window.location.href = "/unauthorized";
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || "Erreur de connexion");
      } else if (error.request) {
        throw new Error(`Le serveur ne répond pas. Backend utilisé : ${API_URL}`);
      } else {
        throw new Error("Erreur lors de la requête : " + error.message);
      }
    }
  },

  validateToken: async () => {
    const response = await axiosInstance.post("/api/auth/validate");
    return response.data;
  },
};

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

export const isAuthenticated = () => {
  const token = getAuthToken();
  const userInfo = getUserInfo();

  if (!token || !userInfo) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      removeAuthToken();
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