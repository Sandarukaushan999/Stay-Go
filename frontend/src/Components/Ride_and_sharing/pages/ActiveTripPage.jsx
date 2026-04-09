import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppButton from '../components/common/AppButton';
import LiveTrackingMap from '../components/maps/LiveTrackingMap';
import MapLegend from '../components/maps/MapLegend';
import CrashReportForm from '../components/rider/CrashReportForm';
import PassengerTripStatus from '../components/passenger/PassengerTripStatus';
import useAuth from '../hooks/useAuth';
import useLiveLocation from '../hooks/useLiveLocation';
import useOverdueTripMonitor from '../hooks/useOverdueTripMonitor';
import useRideTimer from '../hooks/useRideTimer';
import { reportIncident } from '../services/incidentService';
import { sendTripSos, updateTripLocation } from '../services/trackingService';

const ActiveTripPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trip, error, setTrip } = useLiveLocation(tripId);
  const { elapsedSeconds } = useRideTimer(trip?.startedAt);
  const [message, setMessage] = useState('');
  const [locationBusy, setLocationBusy] = useState(false);

  useOverdueTripMonitor({
    trip,
    bufferMinutes: trip?.bufferMinutes || 15,
    onOverdue: () => setMessage('Trip appears overdue. Safety check should be triggered.'),
  });

  useEffect(() => {
    if (error) {
      setMessage(error);
    }
  }, [error]);

  const pushLocationUpdate = useCallback(() => {
    if (!navigator.geolocation) {
      setMessage('Geolocation is not supported in this browser.');
      return;
    }

    setLocationBusy(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const updatedTrip = await updateTripLocation(tripId, {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            addressText: 'Browser GPS update',
          });
          setTrip(updatedTrip);
          setMessage('Location updated.');
        } catch (updateError) {
          setMessage(updateError.message);
        } finally {
          setLocationBusy(false);
        }
      },
      () => {
        setMessage('Unable to fetch current location.');
        setLocationBusy(false);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, [setTrip, tripId]);

  const handleSos = async () => {
    try {
      await sendTripSos(tripId);
      setMessage('SOS sent to admin and emergency workflow.');
    } catch (sosError) {
      setMessage(sosError.message);
    }
  };

  const handleIncident = async (payload) => {
    try {
      await reportIncident({ ...payload, tripId });
      setMessage('Incident reported. Admin and participants were notified.');
    } catch (incidentError) {
      setMessage(incidentError.message);
    }
  };

  return (
    <main className="page-shell">
      <section className="panel page-header">
        <h1>Active Trip Tracking</h1>
        <div className="button-row">
          <AppButton variant="ghost" onClick={() => navigate('/trip/history')}>
            Trip History
          </AppButton>
          <AppButton variant="ghost" onClick={() => navigate(-1)}>
            Back
          </AppButton>
        </div>
      </section>

      {message ? <p className="app-info">{message}</p> : null}

      <section className="panel">
        <p>Elapsed Time: {Math.floor(elapsedSeconds / 60)} min {elapsedSeconds % 60} sec</p>
      </section>

      <LiveTrackingMap trip={trip} />
      <MapLegend />

      <PassengerTripStatus trip={trip} onSos={handleSos} />

      <section className="panel button-row">
        <AppButton variant="danger" onClick={handleSos}>
          Trigger SOS
        </AppButton>
        {user?.role === 'rider' ? (
          <AppButton onClick={pushLocationUpdate} disabled={locationBusy}>
            {locationBusy ? 'Updating...' : 'Send Location Update'}
          </AppButton>
        ) : null}
      </section>

      {user?.role === 'rider' ? (
        <CrashReportForm
          tripId={tripId}
          defaultLocation={trip?.currentLocation}
          onSubmit={(payload) => handleIncident({ ...payload, tripId })}
        />
      ) : null}
    </main>
  );
};

export default ActiveTripPage;
