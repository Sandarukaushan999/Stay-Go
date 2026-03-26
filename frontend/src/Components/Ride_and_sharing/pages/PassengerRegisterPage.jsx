import React from 'react';
import { useNavigate } from 'react-router-dom';
import PassengerRegistrationForm from '../components/passenger/PassengerRegistrationForm';
import useAuth from '../hooks/useAuth';

const PassengerRegisterPage = () => {
  const navigate = useNavigate();
  const { registerPassenger, isLoading, error } = useAuth();

  const handleRegister = async (payload) => {
    await registerPassenger(payload);
    navigate('/passenger/dashboard');
  };

  return (
    <main className="page-shell">
      <section className="panel">
        <h1>Passenger Registration</h1>
        {error ? <p className="app-error">{error}</p> : null}
        <PassengerRegistrationForm onSubmit={handleRegister} submitting={isLoading} />
      </section>
    </main>
  );
};

export default PassengerRegisterPage;
