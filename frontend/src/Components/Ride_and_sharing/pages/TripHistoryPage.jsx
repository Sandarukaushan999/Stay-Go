import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppButton from '../components/common/AppButton';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/common/StatusBadge';
import { formatDateTime, formatDistanceMeters, formatDurationSeconds } from '../utils/formatters';
import { getTripHistory } from '../services/trackingService';

const TripHistoryPage = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const history = await getTripHistory();
        setTrips(history);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <main className="page-shell">
      <section className="panel page-header">
        <h1>Trip History</h1>
        <AppButton variant="ghost" onClick={() => navigate(-1)}>
          Back
        </AppButton>
      </section>

      {loading ? <p>Loading trip history...</p> : null}
      {error ? <p className="app-error">{error}</p> : null}

      {!loading && trips.length === 0 ? <EmptyState title="No trips yet" description="Completed trips appear here." /> : null}

      <div className="list-grid">
        {trips.map((trip) => (
          <article className="panel" key={trip._id || trip.id}>
            <div className="panel-head">
              <h4>Trip #{trip._id?.slice(-6) || trip.id?.slice(-6)}</h4>
              <StatusBadge status={trip.status} />
            </div>
            <p>Started: {formatDateTime(trip.startedAt)}</p>
            <p>Completed: {formatDateTime(trip.completedAt)}</p>
            <p>Distance: {formatDistanceMeters(trip.distanceMeters)}</p>
            <p>Duration: {formatDurationSeconds(trip.expectedDurationSeconds)}</p>
          </article>
        ))}
      </div>
    </main>
  );
};

export default TripHistoryPage;
