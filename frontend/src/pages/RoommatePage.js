import React, { useEffect, useState } from 'react';
import { roommateService } from '../services/api';
import { Link } from 'react-router-dom';

const RoommatePage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    roommateService
      .getMatches()
      .then((res) => setMatches(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load matches'))
      .finally(() => setLoading(false));
  }, []);

  const sendRequest = async (userId) => {
    try {
      await roommateService.sendRequest(userId);
      setMessage('Match request sent!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/dashboard" style={styles.back}>← Dashboard</Link>
        <h2 style={styles.title}>🛏 Roommate Matches</h2>
      </div>
      {message && <p style={styles.msg}>{message}</p>}
      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.grid}>
        {matches.map((m) => (
          <div key={m.user._id} style={styles.card}>
            <h3 style={styles.name}>{m.user.name}</h3>
            <p style={styles.email}>{m.user.email}</p>
            <div style={styles.score}>
              Compatibility: <strong>{m.compatibilityScore}%</strong>
            </div>
            <button style={styles.btn} onClick={() => sendRequest(m.user._id)}>
              Send Match Request
            </button>
          </div>
        ))}
        {!loading && matches.length === 0 && <p>No matches found. Set up your profile first.</p>}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '2rem', background: '#f0f4f8', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  back: { color: '#4299e1', textDecoration: 'none' },
  title: { color: '#2d3748', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' },
  card: { background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  name: { color: '#2d3748', margin: '0 0 0.25rem' },
  email: { color: '#718096', fontSize: '0.9rem', margin: '0 0 0.75rem' },
  score: { marginBottom: '1rem', color: '#2d3748' },
  btn: { background: '#4299e1', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', width: '100%' },
  error: { color: '#e53e3e' },
  msg: { color: '#38a169', marginBottom: '1rem' },
};

export default RoommatePage;
