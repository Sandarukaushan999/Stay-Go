import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  approveRider,
  getAdminDashboard,
  getAdminIncidents,
  getAdminRiders,
  getAdminTrips,
} from '../api/adminApi';
import AdminStatsCards from '../components/admin/AdminStatsCards';
import RiderApprovalPanel from '../components/admin/RiderApprovalPanel';
import SafetyAlertsPanel from '../components/admin/SafetyAlertsPanel';
import TripsTable from '../components/admin/TripsTable';
import { getMyNotifications } from '../services/notificationService';
import { onNewNotification } from '../services/trackingService';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [trips, setTrips] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [riders, setRiders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, tripsData, incidentsData, ridersData, notificationsData] = await Promise.all([
          getAdminDashboard(),
          getAdminTrips(),
          getAdminIncidents(),
          getAdminRiders(),
          getMyNotifications(),
        ]);

        setStats(statsData);
        setTrips(tripsData.trips || []);
        setIncidents(incidentsData.incidents || []);
        setRiders(ridersData.riders || []);
        setNotifications(notificationsData || []);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    load();
  }, []);

  useEffect(() => {
    const unsubscribe = onNewNotification((notification) => {
      if (!notification) {
        return;
      }

      setNotifications((previous) => [
        notification,
        ...previous.filter((item) => String(item._id || item.id) !== String(notification._id || notification.id)),
      ]);
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const handleApprove = async (rider) => {
    await approveRider(rider._id || rider.id);
    const ridersData = await getAdminRiders();
    setRiders(ridersData.riders || []);
  };

  return (
    <main className="page-shell">
      <section className="panel page-header">
        <h1>Admin Dashboard</h1>
        <div className="button-row">
          <Link to="/admin/riders">Riders</Link>
          <Link to="/admin/passengers">Passengers</Link>
          <Link to="/admin/users">All Users</Link>
          <Link to="/admin/trips">Trips</Link>
          <Link to="/admin/incidents">Incidents</Link>
        </div>
      </section>

      {error ? <p className="app-error">{error}</p> : null}

      <AdminStatsCards stats={stats} />
      <SafetyAlertsPanel trips={trips} incidents={incidents} notifications={notifications} />
      <RiderApprovalPanel riders={riders} onApprove={handleApprove} />

      <section className="panel">
        <h3>Recent Trips</h3>
        <TripsTable trips={trips.slice(0, 10)} />
      </section>
    </main>
  );
};

export default AdminDashboardPage;
