import React from 'react';
import AppButton from '../common/AppButton';
import StatusBadge from '../common/StatusBadge';
import { formatDateTime, formatDistanceMeters, formatDurationSeconds } from '../../utils/formatters';

const PassengerTripStatus = ({ trip, onSos }) => {
  if (!trip) {
    return <p>No active trip.</p>;
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h3>Active Trip Status</h3>
        <StatusBadge status={trip.status} />
      </div>
      <p>Started: {formatDateTime(trip.startedAt)}</p>
      <p>Distance: {formatDistanceMeters(trip.distanceMeters)}</p>
      <p>Expected Duration: {formatDurationSeconds(trip.expectedDurationSeconds)}</p>
      <p>Safety Deadline: {formatDateTime(trip.bufferedDeadlineAt)}</p>
      <p>
        Current Location: {trip.currentLocation?.lat?.toFixed?.(5)}, {trip.currentLocation?.lng?.toFixed?.(5)}
      </p>

      <AppButton variant="danger" onClick={() => onSos?.(trip)}>
        SOS
      </AppButton>
    </section>
  );
};

export default PassengerTripStatus;
