import React from 'react';
import { formatDateTime } from '../../utils/formatters';

const TripsTable = ({ trips = [] }) => {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Trip</th>
            <th>Rider</th>
            <th>Passenger</th>
            <th>Status</th>
            <th>Started</th>
            <th>Completed</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip._id || trip.id}>
              <td>{trip._id?.slice(-8) || trip.id?.slice(-8)}</td>
              <td>{trip.riderId?.name || '-'}</td>
              <td>{trip.passengerId?.name || '-'}</td>
              <td>{trip.status}</td>
              <td>{formatDateTime(trip.startedAt)}</td>
              <td>{formatDateTime(trip.completedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TripsTable;
