import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import RideSharingRoutes from './routes/rideSharingRoutes';
import './styles/rideSharing.css';
import './styles/map.css';
import './styles/rider.css';
import './styles/passenger.css';
import './styles/admin.css';

const ModuleContent = () => {
  useAuth();
  return <RideSharingRoutes />;
};

const RideSharingModule = () => {
  return (
    <BrowserRouter>
      <ModuleContent />
    </BrowserRouter>
  );
};

export default RideSharingModule;
