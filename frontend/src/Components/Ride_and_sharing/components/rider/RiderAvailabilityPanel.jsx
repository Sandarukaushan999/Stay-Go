import React from 'react';
import AppButton from '../common/AppButton';

const RiderAvailabilityPanel = ({ isOnline = false, onToggle }) => {
  return (
    <section className="panel">
      <h3>Availability</h3>
      <p>Current status: {isOnline ? 'Online' : 'Offline'}</p>
      <AppButton onClick={() => onToggle?.(!isOnline)}>{isOnline ? 'Go Offline' : 'Go Online'}</AppButton>
    </section>
  );
};

export default RiderAvailabilityPanel;
