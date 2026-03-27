import React, { useEffect, useRef } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import RideSharingRoutes from './routes/rideSharingRoutes';
import './styles/rideSharing.css';
import './styles/map.css';
import './styles/rider.css';
import './styles/passenger.css';
import './styles/admin.css';

const ModuleContent = ({ initialPath }) => {
  useAuth(true);
  const navigate = useNavigate();
  const location = useLocation();
  const hasAppliedInitialPath = useRef(false);

  useEffect(() => {
    if (hasAppliedInitialPath.current) {
      return;
    }

    hasAppliedInitialPath.current = true;

    if (!initialPath || location.pathname === initialPath) {
      return;
    }

    navigate(initialPath, { replace: true });
  }, [initialPath, location.pathname, navigate]);

  return <RideSharingRoutes />;
};

const RideSharingModule = ({ initialPath = '/' }) => {
  return (
    <BrowserRouter>
      <ModuleContent initialPath={initialPath} />
    </BrowserRouter>
  );
};

export default RideSharingModule;
