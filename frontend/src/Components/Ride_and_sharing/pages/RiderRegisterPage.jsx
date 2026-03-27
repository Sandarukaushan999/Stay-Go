import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RiderRegistrationForm from '../components/rider/RiderRegistrationForm';
import AppButton from '../components/common/AppButton';
import useAuth from '../hooks/useAuth';

const RiderRegisterPage = () => {
  const navigate = useNavigate();
  const { registerRider, isLoading, error } = useAuth();
  const [submitError, setSubmitError] = useState('');

  const handleRegister = async (payload) => {
    setSubmitError('');

    try {
      await registerRider(payload);
      navigate('/rider/dashboard');
    } catch (registerError) {
      if (registerError.message === 'Email already registered') {
        setSubmitError('Email already registered. Please use a different email or sign in.');
        return;
      }

      setSubmitError(registerError.message || 'Failed to register rider.');
    }
  };

  return (
    <main className="page-shell">
      <section className="panel">
        <h1>Rider Registration</h1>
        {submitError ? <p className="app-error">{submitError}</p> : null}
        {!submitError && error ? <p className="app-error">{error}</p> : null}
        {submitError ? (
          <div className="button-row">
            <AppButton variant="ghost" onClick={() => navigate('/')}>
              Go To Login
            </AppButton>
          </div>
        ) : null}
        <RiderRegistrationForm onSubmit={handleRegister} submitting={isLoading} />
      </section>
    </main>
  );
};

export default RiderRegisterPage;
