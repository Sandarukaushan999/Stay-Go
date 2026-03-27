import React from 'react';

const statKeys = [
  ['totalRiders', 'Total Riders'],
  ['totalPassengers', 'Total Passengers'],
  ['activeRides', 'Active Rides'],
  ['overdueRides', 'Overdue Rides'],
  ['incidentsToday', 'Incidents Today'],
  ['approvedRiders', 'Approved Riders'],
  ['blockedUsers', 'Blocked Users'],
];

const AdminStatsCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="stats-grid">
      {statKeys.map(([key, label]) => (
        <article className="panel" key={key}>
          <h4>{label}</h4>
          <strong>{stats[key] ?? 0}</strong>
        </article>
      ))}
    </div>
  );
};

export default AdminStatsCards;
