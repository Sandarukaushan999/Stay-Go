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

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [trips, setTrips] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [riders, setRiders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, tripsData, incidentsData, ridersData] = await Promise.all([
          getAdminDashboard(),
          getAdminTrips(),
          getAdminIncidents(),
          getAdminRiders(),
        ]);

        setStats(statsData);
        setTrips(tripsData.trips || []);
        setIncidents(incidentsData.incidents || []);
        setRiders(ridersData.riders || []);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    load();
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
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/trips">Trips</Link>
          <Link to="/admin/incidents">Incidents</Link>
        </div>
      </section>

      {error ? <p className="app-error">{error}</p> : null}

      <AdminStatsCards stats={stats} />
      <SafetyAlertsPanel trips={trips} incidents={incidents} />
      <RiderApprovalPanel riders={riders} onApprove={handleApprove} />

      <section className="panel">
        <h3>Recent Trips</h3>
        <TripsTable trips={trips.slice(0, 10)} />
      </section>
    </main>
  );
};

export default AdminDashboardPage;
