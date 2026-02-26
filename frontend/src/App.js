import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RoommatePage from './pages/RoommatePage';
import RidesPage from './pages/RidesPage';
import MaintenancePage from './pages/MaintenancePage';
import AdminPage from './pages/AdminPage';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/roommates"
            element={
              <PrivateRoute roles={['student']}>
                <RoommatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/rides"
            element={
              <PrivateRoute>
                <RidesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <PrivateRoute>
                <MaintenancePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
