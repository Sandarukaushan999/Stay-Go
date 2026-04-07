import React from 'react';
import AppButton from '../common/AppButton';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';

const RideRequestList = ({ rides = [], onAccept, onStart, onComplete }) => {
  if (rides.length === 0) {
    return <EmptyState title="No ride requests" description="Incoming requests will appear here." />;
  }

  return (
    <div className="list-grid">
      {rides.map((ride) => (
        <article className="panel" key={ride._id || ride.id}>
          <div className="panel-head">
            <h4>Ride #{ride._id?.slice(-6) || ride.id?.slice(-6)}</h4>
            <StatusBadge status={ride.status} />
          </div>
          <p>Passenger: {ride.passengerId?.name || ride.passengerName || 'N/A'}</p>
          <p>From: {ride.origin?.addressText || `${ride.origin?.lat}, ${ride.origin?.lng}`}</p>
          <p>To: {ride.destination?.addressText || `${ride.destination?.lat}, ${ride.destination?.lng}`}</p>

          <div className="button-row">
            {ride.status === 'requested' ? (
              <AppButton onClick={() => onAccept?.(ride)}>Accept</AppButton>
            ) : null}
            {ride.status === 'accepted' ? <AppButton onClick={() => onStart?.(ride)}>Start</AppButton> : null}
            {ride.status === 'started' ? (
              <AppButton variant="success" onClick={() => onComplete?.(ride)}>
                Complete
              </AppButton>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
};

export default RideRequestList;
