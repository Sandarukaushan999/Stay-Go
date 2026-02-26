import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const modules = [
    { label: '🛏 Roommate Matching', path: '/roommates', roles: ['student'] },
    { label: '🚘 Ride Sharing', path: '/rides', roles: ['student', 'driver'] },
    { label: '🔧 Maintenance', path: '/maintenance', roles: ['student', 'technician', 'admin'] },
    { label: '⚙️ Admin Panel', path: '/admin', roles: ['admin'] },
  ];

  const available = modules.filter((m) => m.roles.includes(user?.role));

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🏠🚗 Stay &amp; Go</h1>
        <div style={styles.userInfo}>
          <span>Welcome, <strong>{user?.name}</strong> ({user?.role})</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </header>
      <main style={styles.main}>
        <h2 style={styles.heading}>Dashboard</h2>
        <div style={styles.grid}>
          {available.map((m) => (
            <Link key={m.path} to={m.path} style={styles.card}>
              <span style={styles.cardLabel}>{m.label}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f0f4f8' },
  header: { background: '#2d3748', color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { margin: 0, fontSize: '1.5rem' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '1rem' },
  logoutBtn: { background: '#e53e3e', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' },
  main: { padding: '2rem' },
  heading: { color: '#2d3748', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' },
  card: { background: '#fff', borderRadius: '8px', padding: '2rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textDecoration: 'none', color: '#2d3748', fontSize: '1.1rem', fontWeight: 600, transition: 'box-shadow 0.2s' },
  cardLabel: { display: 'block' },
};

export default DashboardPage;
