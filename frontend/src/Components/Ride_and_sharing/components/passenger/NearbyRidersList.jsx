import React from 'react';
import AppButton from '../common/AppButton';
import EmptyState from '../common/EmptyState';

const NearbyRidersList = ({ riders = [], selectedRiderId, onSelect }) => {
  if (riders.length === 0) {
    return <EmptyState title="No riders found" description="Try a different pickup point or campus." />;
  }

  return (
    <div className="list-grid">
      {riders.map((rider) => (
        <article className="panel" key={rider.id}>
          <h4>{rider.name}</h4>
          <p>{rider.vehicleType} - {rider.vehicleNumber}</p>
          <p>Seats: {rider.seatCount}</p>
          <p>Distance: {rider.distanceMeters ? `${Math.round(rider.distanceMeters)} m` : 'N/A'}</p>
          <AppButton
            variant={selectedRiderId === rider.id ? 'secondary' : 'primary'}
            onClick={() => onSelect?.(rider)}
          >
            {selectedRiderId === rider.id ? 'Selected' : 'Select Rider'}
          </AppButton>
        </article>
      ))}
    </div>
  );
};

export default NearbyRidersList;
