import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([adminService.listUsers(), adminService.listComplaints()])
      .then(([usersRes, complaintsRes]) => {
        setUsers(usersRes.data);
        setComplaints(complaintsRes.data);
      })
      .catch(() => setMessage('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const toggleUser = async (id, isActive) => {
    try {
      await adminService.updateUser(id, { isActive: !isActive });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive: !isActive } : u)));
      setMessage('User updated');
    } catch {
      setMessage('Failed to update user');
    }
  };

  const resolveComplaint = async (id) => {
    try {
      await adminService.updateComplaint(id, { status: 'resolved' });
      setComplaints((prev) => prev.map((c) => (c._id === id ? { ...c, status: 'resolved' } : c)));
      setMessage('Complaint resolved');
    } catch {
      setMessage('Failed to resolve complaint');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/dashboard" style={styles.back}>← Dashboard</Link>
        <h2 style={styles.title}>⚙️ Admin Panel</h2>
      </div>
      {message && <p style={styles.msg}>{message}</p>}
      <div style={styles.tabs}>
        <button style={tab === 'users' ? styles.activeTab : styles.tab} onClick={() => setTab('users')}>Users</button>
        <button style={tab === 'complaints' ? styles.activeTab : styles.tab} onClick={() => setTab('complaints')}>Complaints</button>
      </div>
      {loading && <p>Loading...</p>}
      {tab === 'users' && (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={styles.td}>{u.name}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>{u.role}</td>
                  <td style={styles.td}>{u.isActive ? '✅ Active' : '❌ Inactive'}</td>
                  <td style={styles.td}>
                    <button style={u.isActive ? styles.deactivateBtn : styles.activateBtn} onClick={() => toggleUser(u._id, u.isActive)}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'complaints' && (
        <div style={styles.list}>
          {complaints.map((c) => (
            <div key={c._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <strong>{c.subject}</strong>
                <span style={{ ...styles.badge, background: c.status === 'resolved' ? '#48bb78' : '#ed8936' }}>{c.status}</span>
              </div>
              <p style={styles.desc}>{c.description}</p>
              <p style={styles.meta}>From: {c.submittedBy?.name} | Type: {c.type}</p>
              {c.status !== 'resolved' && (
                <button style={styles.btn} onClick={() => resolveComplaint(c._id)}>Mark Resolved</button>
              )}
            </div>
          ))}
          {!loading && complaints.length === 0 && <p>No complaints.</p>}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '2rem', background: '#f0f4f8', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  back: { color: '#4299e1', textDecoration: 'none' },
  title: { color: '#2d3748', margin: 0 },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: { padding: '0.5rem 1.5rem', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  activeTab: { padding: '0.5rem 1.5rem', background: '#4299e1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  th: { background: '#2d3748', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left' },
  td: { padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#4a5568' },
  deactivateBtn: { background: '#e53e3e', color: '#fff', border: 'none', padding: '0.3rem 0.75rem', borderRadius: '4px', cursor: 'pointer' },
  activateBtn: { background: '#48bb78', color: '#fff', border: 'none', padding: '0.3rem 0.75rem', borderRadius: '4px', cursor: 'pointer' },
  list: { display: 'grid', gap: '1rem' },
  card: { background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '12px', color: '#fff', fontSize: '0.8rem' },
  desc: { color: '#4a5568', margin: '0.25rem 0' },
  meta: { color: '#718096', fontSize: '0.85rem', margin: '0.2rem 0' },
  btn: { background: '#48bb78', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem' },
  msg: { color: '#38a169', marginBottom: '1rem' },
};

export default AdminPage;
