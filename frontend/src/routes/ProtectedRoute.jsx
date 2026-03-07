// src/components/ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { getUserInfo, getAuthToken, removeAuthToken } from '../services/api';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const token = getAuthToken();
  const userInfo = getUserInfo();
  const location = useLocation();

  // Pas de token
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier expiration JWT côté client
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      removeAuthToken();
      return <Navigate to="/login?session=expired" replace />;
    }
  } catch (e) {
    removeAuthToken();
    return <Navigate to="/login" replace />;
  }

  // userInfo absent ou corrompu
  if (!userInfo?.role) {
    removeAuthToken();
    return <Navigate to="/login" replace />;
  }

  // Rôle insuffisant
  if (requiredRole && userInfo.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;