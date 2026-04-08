import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminTrips } from '../api/adminApi';
import TripsTable from '../components/admin/TripsTable';

const AdminTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminTrips();
        setTrips(data.trips || []);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    load();
  }, []);

  return (
    <main className="page-shell">
      <section className="panel page-header">
        <h1>Admin Trips</h1>
        <Link to="/admin/dashboard">Back to Dashboard</Link>
      </section>

      {error ? <p className="app-error">{error}</p> : null}
      <TripsTable trips={trips} />
    </main>
  );
};

export default AdminTripsPage;
