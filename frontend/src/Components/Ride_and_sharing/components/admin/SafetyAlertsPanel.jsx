import React from 'react';

const SafetyAlertsPanel = ({ trips = [], incidents = [] }) => {
  const overdueTrips = trips.filter((trip) => trip.status === 'overdue');

  return (
    <section className="panel">
      <h3>Safety Alerts</h3>
      <p>Overdue Trips: {overdueTrips.length}</p>
      <p>Total Incidents: {incidents.length}</p>
      <ul className="compact-list">
        {overdueTrips.slice(0, 5).map((trip) => (
          <li key={trip._id || trip.id}>Trip {trip._id?.slice(-8) || trip.id?.slice(-8)} is overdue</li>
        ))}
      </ul>
    </section>
  );
};

export default SafetyAlertsPanel;
