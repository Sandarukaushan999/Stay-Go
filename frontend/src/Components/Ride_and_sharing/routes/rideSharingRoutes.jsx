import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Loader from '../components/common/Loader';
import ActiveTripPage from '../pages/ActiveTripPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import AdminIncidentsPage from '../pages/AdminIncidentsPage';
import AdminTripsPage from '../pages/AdminTripsPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import PassengerDashboardPage from '../pages/PassengerDashboardPage';
import PassengerRegisterPage from '../pages/PassengerRegisterPage';
import RiderDashboardPage from '../pages/RiderDashboardPage';
import RiderRegisterPage from '../pages/RiderRegisterPage';
import RideSharingHomePage from '../pages/RideSharingHomePage';
import TripHistoryPage from '../pages/TripHistoryPage';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <Loader text="Checking session..." />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const RideSharingRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RideSharingHomePage />} />
      <Route path="/login" element={<RideSharingHomePage />} />
      <Route path="/rider/register" element={<RiderRegisterPage />} />
      <Route path="/passenger/register" element={<PassengerRegisterPage />} />

      <Route
        path="/rider/dashboard"
        element={
          <ProtectedRoute allowedRoles={['rider']}>
            <RiderDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/passenger/dashboard"
        element={
          <ProtectedRoute allowedRoles={['passenger']}>
            <PassengerDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trip/active/:tripId"
        element={
          <ProtectedRoute allowedRoles={['rider', 'passenger', 'admin']}>
            <ActiveTripPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trip/history"
        element={
          <ProtectedRoute allowedRoles={['rider', 'passenger', 'admin']}>
            <TripHistoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/trips"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminTripsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/incidents"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminIncidentsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default RideSharingRoutes;
