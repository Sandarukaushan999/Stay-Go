import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AppButton from '../components/common/AppButton';
import AppInput from '../components/common/AppInput';
import useAuth from '../hooks/useAuth';
import { loginSchema } from '../utils/validators';

const RideSharingHomePage = () => {
  const navigate = useNavigate();
  const { login, user, error, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    const loggedInUser = await login(values);

    if (loggedInUser.role === 'admin') navigate('/admin/dashboard');
    if (loggedInUser.role === 'rider') navigate('/rider/dashboard');
    if (loggedInUser.role === 'passenger') navigate('/passenger/dashboard');
  };

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <h1>Stay-Go Ride Sharing</h1>
        <p>OpenStreetMap + OSRM campus ride management with rider, passenger, and admin roles.</p>
      </section>

      <section className="panel form-panel">
        <h2>Login</h2>
        {user ? <p>Logged in as {user.name} ({user.role})</p> : null}
        <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
          <AppInput label="Email" error={errors.email?.message} {...register('email')} />
          <AppInput
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register('password')}
          />
          {error ? <p className="app-error">{error}</p> : null}
          <AppButton type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </AppButton>
        </form>
      </section>

      <section className="panel split-links">
        <div>
          <h3>Rider</h3>
          <Link to="/rider/register">Create Rider Profile</Link>
        </div>
        <div>
          <h3>Passenger</h3>
          <Link to="/passenger/register">Create Passenger Profile</Link>
        </div>
      </section>

      <section className="panel credentials-panel">
        <h3>Seed Credentials</h3>
        <p>Admin: admin@gmail.com / admin123</p>
        <p>Rider: rider@staygo.local / Rider@12345</p>
        <p>Passenger: passenger@staygo.local / Passenger@12345</p>
      </section>
    </main>
  );
};

export default RideSharingHomePage;
