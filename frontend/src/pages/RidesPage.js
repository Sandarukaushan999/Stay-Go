import React, { useEffect, useState } from 'react';
import { rideService } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';

const RidesPage = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    origin: { address: '' },
    destination: { address: '' },
    departureTime: '',
    seatsAvailable: 2,
    farePerKm: 10,
  });

  const loadRides = () => {
    setLoading(true);
    rideService
      .listRides()
      .then((res) => setRides(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load rides'))
      .finally(() => setLoading(false));
  };

  useEffect(loadRides, []);

  const requestRide = async (id) => {
    try {
      await rideService.requestRide(id);
      setMessage('Ride requested successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to request ride');
    }
  };

  const createRide = async (e) => {
    e.preventDefault();
    try {
      await rideService.createRide({
        origin: { address: form.origin.address },
        destination: { address: form.destination.address },
        departureTime: form.departureTime,
        seatsAvailable: Number(form.seatsAvailable),
        farePerKm: Number(form.farePerKm),
      });
      setMessage('Ride created!');
      setShowForm(false);
      loadRides();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create ride');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/dashboard" style={styles.back}>← Dashboard</Link>
        <h2 style={styles.title}>🚘 Ride Sharing</h2>
        {user?.role === 'driver' && (
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Offer Ride'}
          </button>
        )}
      </div>
      {message && <p style={styles.msg}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
      {showForm && (
        <form onSubmit={createRide} style={styles.form}>
          <input style={styles.input} placeholder="Origin" value={form.origin.address} onChange={(e) => setForm({ ...form, origin: { address: e.target.value } })} required />
          <input style={styles.input} placeholder="Destination" value={form.destination.address} onChange={(e) => setForm({ ...form, destination: { address: e.target.value } })} required />
          <input style={styles.input} type="datetime-local" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} required />
          <input style={styles.input} type="number" placeholder="Seats Available" min={1} value={form.seatsAvailable} onChange={(e) => setForm({ ...form, seatsAvailable: e.target.value })} required />
          <input style={styles.input} type="number" placeholder="Fare per KM" min={1} value={form.farePerKm} onChange={(e) => setForm({ ...form, farePerKm: e.target.value })} required />
          <button style={styles.btn} type="submit">Create Ride</button>
        </form>
      )}
      {loading && <p>Loading...</p>}
      <div style={styles.grid}>
        {rides.map((r) => (
          <div key={r._id} style={styles.card}>
            <p><strong>From:</strong> {r.origin?.address}</p>
            <p><strong>To:</strong> {r.destination?.address}</p>
            <p><strong>Departure:</strong> {new Date(r.departureTime).toLocaleString()}</p>
            <p><strong>Seats:</strong> {r.seatsAvailable} | <strong>Fare:</strong> {r.farePerKm}/km</p>
            <p><strong>Driver:</strong> {r.driver?.name}</p>
            {user?.role === 'student' && (
              <button style={styles.btn} onClick={() => requestRide(r._id)}>Request Ride</button>
            )}
          </div>
        ))}
        {!loading && rides.length === 0 && <p>No rides available.</p>}
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
  input: { padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e0', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' },
  card: { background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  btn: { background: '#4299e1', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', width: '100%', marginTop: '0.5rem' },
  error: { color: '#e53e3e' },
  msg: { color: '#38a169', marginBottom: '1rem' },
};

export default RidesPage;
