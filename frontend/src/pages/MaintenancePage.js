import React, { useEffect, useState } from 'react';
import { maintenanceService } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';

const CATEGORIES = ['plumbing', 'electrical', 'furniture', 'cleaning', 'other'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const statusColor = {
  open: '#718096',
  assigned: '#4299e1',
  in_progress: '#ed8936',
  resolved: '#48bb78',
  closed: '#a0aec0',
};

const MaintenancePage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'plumbing', priority: 'medium', roomNumber: '' });

  const loadTickets = () => {
    setLoading(true);
    maintenanceService
      .listTickets()
      .then((res) => setTickets(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load tickets'))
      .finally(() => setLoading(false));
  };

  useEffect(loadTickets, []);

  const createTicket = async (e) => {
    e.preventDefault();
    try {
      await maintenanceService.createTicket(form);
      setMessage('Maintenance request submitted!');
      setShowForm(false);
      loadTickets();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit request');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await maintenanceService.updateTicket(id, { status });
      setMessage('Ticket updated!');
      loadTickets();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update ticket');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/dashboard" style={styles.back}>← Dashboard</Link>
        <h2 style={styles.title}>🔧 Maintenance</h2>
        {user?.role === 'student' && (
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Request'}
          </button>
        )}
      </div>
      {message && <p style={styles.msg}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
      {showForm && (
        <form onSubmit={createTicket} style={styles.form}>
          <input style={styles.input} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea style={{ ...styles.input, height: '80px' }} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <select style={styles.input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select style={styles.input} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <input style={styles.input} placeholder="Room Number" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} />
          <button style={styles.btn} type="submit">Submit Request</button>
        </form>
      )}
      {loading && <p>Loading...</p>}
      <div style={styles.list}>
        {tickets.map((t) => (
          <div key={t._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <strong>{t.title}</strong>
              <span style={{ ...styles.badge, background: statusColor[t.status] || '#718096' }}>{t.status}</span>
            </div>
            <p style={styles.desc}>{t.description}</p>
            <p style={styles.meta}>Category: {t.category} | Priority: {t.priority} | Room: {t.roomNumber || 'N/A'}</p>
            <p style={styles.meta}>Submitted by: {t.submittedBy?.name}</p>
            {(user?.role === 'technician' || user?.role === 'admin') && t.status !== 'closed' && (
              <select style={styles.select} defaultValue={t.status} onChange={(e) => updateStatus(t._id, e.target.value)}>
                {['open', 'assigned', 'in_progress', 'resolved', 'closed'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </div>
        ))}
        {!loading && tickets.length === 0 && <p>No maintenance tickets.</p>}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '2rem', background: '#f0f4f8', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  back: { color: '#4299e1', textDecoration: 'none' },
  title: { color: '#2d3748', margin: 0, flex: 1 },
  addBtn: { background: '#48bb78', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' },
  form: { background: '#fff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'grid', gap: '0.75rem', maxWidth: '480px' },
  input: { padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e0', fontSize: '1rem', width: '100%', boxSizing: 'border-box' },
  list: { display: 'grid', gap: '1rem' },
  card: { background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '12px', color: '#fff', fontSize: '0.8rem' },
  desc: { color: '#4a5568', margin: '0.25rem 0' },
  meta: { color: '#718096', fontSize: '0.85rem', margin: '0.2rem 0' },
  btn: { background: '#4299e1', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' },
  select: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e0', marginTop: '0.5rem', width: '100%' },
  error: { color: '#e53e3e' },
  msg: { color: '#38a169', marginBottom: '1rem' },
};

export default MaintenancePage;
