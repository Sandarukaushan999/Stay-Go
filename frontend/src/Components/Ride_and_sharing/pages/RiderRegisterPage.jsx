import React from 'react';
import { useNavigate } from 'react-router-dom';
import RiderRegistrationForm from '../components/rider/RiderRegistrationForm';
import useAuth from '../hooks/useAuth';

const RiderRegisterPage = () => {
  const navigate = useNavigate();
  const { registerRider, isLoading, error } = useAuth();

  const handleRegister = async (payload) => {
    await registerRider(payload);
    navigate('/rider/dashboard');
  };

  return (
    <main className="page-shell">
      <section className="panel">
        <h1>Rider Registration</h1>
        {error ? <p className="app-error">{error}</p> : null}
        <RiderRegistrationForm onSubmit={handleRegister} submitting={isLoading} />
      </section>
    </main>
  );
};

export default RiderRegisterPage;
