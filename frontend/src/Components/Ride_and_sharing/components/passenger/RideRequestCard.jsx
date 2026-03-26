import React from 'react';
import AppButton from '../common/AppButton';
import StatusBadge from '../common/StatusBadge';
import { formatDistanceMeters, formatDurationSeconds } from '../../utils/formatters';

const RideRequestCard = ({ ride, onCancel, onUnsafe }) => {
  if (!ride) return null;

  return (
    <article className="panel">
      <div className="panel-head">
        <h3>Ride Request</h3>
        <StatusBadge status={ride.status} />
      </div>
      <p>From: {ride.origin?.addressText || `${ride.origin?.lat}, ${ride.origin?.lng}`}</p>
      <p>To: {ride.destination?.addressText || `${ride.destination?.lat}, ${ride.destination?.lng}`}</p>
      <p>Distance: {formatDistanceMeters(ride.distanceMeters)}</p>
      <p>ETA: {formatDurationSeconds(ride.expectedDurationSeconds)}</p>

      <div className="button-row">
        {['requested', 'accepted', 'started'].includes(ride.status) ? (
          <AppButton variant="danger" onClick={() => onCancel?.(ride)}>
            Cancel Ride
          </AppButton>
        ) : null}
        {ride.status === 'started' ? (
          <AppButton variant="warning" onClick={() => onUnsafe?.(ride)}>
            Report Unsafe
          </AppButton>
        ) : null}
      </div>
    </article>
  );
};

export default RideRequestCard;
