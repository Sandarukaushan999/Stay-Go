import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PassengerRegistrationForm from '../components/passenger/PassengerRegistrationForm';
import AppButton from '../components/common/AppButton';
import useAuth from '../hooks/useAuth';

const PassengerRegisterPage = () => {
  const navigate = useNavigate();
  const { registerPassenger, isLoading, error } = useAuth();
  const [submitError, setSubmitError] = useState('');

  const handleRegister = async (payload) => {
    setSubmitError('');

    try {
      await registerPassenger(payload);
      navigate('/passenger/dashboard');
    } catch (registerError) {
      if (registerError.message === 'Email already registered') {
        setSubmitError('Email already registered. Please use a different email or sign in.');
        return;
      }

      setSubmitError(registerError.message || 'Failed to register passenger.');
    }
  };

  return (
    <main className="page-shell">
      <section className="panel">
        <h1>Passenger Registration</h1>
        {submitError ? <p className="app-error">{submitError}</p> : null}
        {!submitError && error ? <p className="app-error">{error}</p> : null}
        {submitError ? (
          <div className="button-row">
            <AppButton variant="ghost" onClick={() => navigate('/login')}>
              Go To Login
            </AppButton>
          </div>
        ) : null}
        <PassengerRegistrationForm onSubmit={handleRegister} submitting={isLoading} />
      </section>
    </main>
  );
};

export default PassengerRegisterPage;
