import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentsList from './pages/Studentslist';
import ProfessorsList from './pages/Professorslist';
import CoursesList from './pages/Courseslist';
import FinanceList from './pages/FinanceList';
import EventsList from './pages/EventsList';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './routes/ProtectedRoute';
import { isAuthenticated } from './services/api';
import Unauthorized from './pages/Unauthorized';

// Redirige vers le dashboard si déjà connecté
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {          // ← utilise la vraie fonction avec vérif expiration
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Routes protégées ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <StudentsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/professors"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <ProfessorsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <CoursesList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/finance"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <FinanceList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <EventsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/profil"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;