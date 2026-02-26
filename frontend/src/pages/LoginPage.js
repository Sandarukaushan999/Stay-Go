import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏠🚗 Stay &amp; Go</h2>
        <h3 style={styles.subtitle}>Sign In</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button style={styles.button} type="submit">Login</button>
        </form>
        <p style={styles.link}>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f4f8' },
  card: { background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', minWidth: '320px' },
  title: { textAlign: 'center', color: '#2d3748', marginBottom: '0.25rem' },
  subtitle: { textAlign: 'center', color: '#718096', marginBottom: '1.5rem', fontWeight: 400 },
  input: { display: 'block', width: '100%', padding: '0.6rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #cbd5e0', fontSize: '1rem', boxSizing: 'border-box' },
  button: { width: '100%', padding: '0.7rem', background: '#4299e1', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' },
  error: { color: '#e53e3e', marginBottom: '1rem', textAlign: 'center' },
  link: { textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' },
};

export default LoginPage;
