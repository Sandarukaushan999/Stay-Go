import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blockUser, getAdminUsers } from '../api/adminApi';
import UsersTable from '../components/admin/UsersTable';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data.users || []);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleBlock = async (user) => {
    await blockUser(user._id || user.id, !user.isBlocked);
    await loadUsers();
  };

  return (
    <main className="page-shell">
      <section className="panel page-header">
        <h1>Admin Users</h1>
        <Link to="/admin/dashboard">Back to Dashboard</Link>
      </section>

      {error ? <p className="app-error">{error}</p> : null}
      <UsersTable users={users} onToggleBlock={handleToggleBlock} />
    </main>
  );
};

export default AdminUsersPage;
