import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminIncidents } from '../api/adminApi';
import IncidentsTable from '../components/admin/IncidentsTable';

const AdminIncidentsPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminIncidents();
        setIncidents(data.incidents || []);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    load();
  }, []);

  return (
    <main className="page-shell">
      <section className="panel page-header">
        <h1>Admin Incidents</h1>
        <Link to="/admin/dashboard">Back to Dashboard</Link>
      </section>

      {error ? <p className="app-error">{error}</p> : null}
      <IncidentsTable incidents={incidents} />
    </main>
  );
};

export default AdminIncidentsPage;
