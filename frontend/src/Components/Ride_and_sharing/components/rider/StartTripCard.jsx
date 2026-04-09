import React from 'react';
import { formatDistanceMeters, formatDurationSeconds } from '../../utils/formatters';
import AppButton from '../common/AppButton';

const StartTripCard = ({ ride, onStart }) => {
  if (!ride) return null;

  return (
    <article className="panel">
      <h3>Ready To Start</h3>
      <p>Origin: {ride.origin?.addressText}</p>
      <p>Destination: {ride.destination?.addressText}</p>
      <p>Distance: {formatDistanceMeters(ride.distanceMeters)}</p>
      <p>ETA: {formatDurationSeconds(ride.expectedDurationSeconds)}</p>
      <AppButton onClick={() => onStart?.(ride)}>Start Trip</AppButton>
    </article>
  );
};

export default StartTripCard;
