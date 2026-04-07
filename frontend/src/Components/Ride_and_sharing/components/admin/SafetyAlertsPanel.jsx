import React from 'react';

function formatRelativeTime(timestamp) {
  const parsed = Date.parse(timestamp || '');

  if (!Number.isFinite(parsed)) {
    return 'Now';
  }

  const diffMinutes = Math.floor(Math.max(0, Date.now() - parsed) / 60000);

  if (diffMinutes < 1) {
    return 'Now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

const SafetyAlertsPanel = ({ trips = [], incidents = [], notifications = [] }) => {
  const overdueTrips = trips.filter((trip) => trip.status === 'overdue');
  const sosAlerts = notifications
    .filter((notification) => String(notification?.type || '').toLowerCase().includes('sos'))
    .slice(0, 5);

  return (
    <section className="panel">
      <h3>Safety Alerts</h3>
      <p>Overdue Trips: {overdueTrips.length}</p>
      <p>Total Incidents: {incidents.length}</p>
      <p>SOS Alerts: {sosAlerts.length}</p>
      <ul className="compact-list">
        {overdueTrips.slice(0, 5).map((trip) => (
          <li key={trip._id || trip.id}>Trip {trip._id?.slice(-8) || trip.id?.slice(-8)} is overdue</li>
        ))}
        {sosAlerts.map((alert) => (
          <li key={alert._id || alert.id}>
            {alert.title || 'SOS Alert'} ({formatRelativeTime(alert.createdAt)})
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SafetyAlertsPanel;
