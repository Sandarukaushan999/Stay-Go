import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRiderProfile, updateRiderAvailability } from '../api/riderApi';
import {
  acceptRideRequest,
  completeRideRequest,
  listMyRideRequests,
  startRideRequest,
} from '../services/rideService';
import { reportIncident } from '../services/incidentService';
import CrashReportForm from '../components/rider/CrashReportForm';
import RideRequestList from '../components/rider/RideRequestList';
import RiderAvailabilityPanel from '../components/rider/RiderAvailabilityPanel';
import RiderProfileCard from '../components/rider/RiderProfileCard';
import StartTripCard from '../components/rider/StartTripCard';
import AppButton from '../components/common/AppButton';
import useAuth from '../hooks/useAuth';

const RiderDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);

  const acceptedRide = useMemo(
    () => rides.find((ride) => ride.status === 'accepted' && String(ride.riderId?._id || ride.riderId) === String(user?.id)),
    [rides, user?.id]
  );

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [profileData, ridesData] = await Promise.all([getRiderProfile(), listMyRideRequests()]);
        setProfile(profileData.user);
        setRides(ridesData);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const refreshRides = async () => {
    const ridesData = await listMyRideRequests();
    setRides(ridesData);
  };

  const handleToggleAvailability = async (nextOnline) => {
    const result = await updateRiderAvailability({
      isOnline: nextOnline,
      availability: nextOnline ? 'online' : 'offline',
    });
    setProfile(result.user);
  };

  const handleAccept = async (ride) => {
    await acceptRideRequest(ride._id || ride.id);
    await refreshRides();
  };

  const handleStart = async (ride) => {
    const result = await startRideRequest(ride._id || ride.id);
    setActiveTrip(result.trip);
    await refreshRides();
    navigate(`/trip/active/${result.trip._id || result.trip.id}`);
  };

  const handleComplete = async (ride) => {
    await completeRideRequest(ride._id || ride.id);
    setActiveTrip(null);
    await refreshRides();
  };

  const handleIncident = async (payload) => {
    await reportIncident(payload);
    alert('Incident reported successfully.');
  };

  return (
    <main className="page-shell">
      <section className="panel page-header">
        <h1>Rider Dashboard</h1>
        <div className="button-row">
          <AppButton variant="ghost" onClick={() => navigate('/trip/history')}>
            Trip History
          </AppButton>
          <AppButton variant="danger" onClick={logout}>
            Logout
          </AppButton>
        </div>
      </section>

      {error ? <p className="app-error">{error}</p> : null}
      {loading ? <p>Loading rider dashboard...</p> : null}

      <RiderProfileCard rider={profile} />
      <RiderAvailabilityPanel isOnline={profile?.isOnline} onToggle={handleToggleAvailability} />

      <RideRequestList rides={rides} onAccept={handleAccept} onStart={handleStart} onComplete={handleComplete} />
      <StartTripCard ride={acceptedRide} onStart={handleStart} />

      {activeTrip ? (
        <CrashReportForm
          tripId={activeTrip._id || activeTrip.id}
          defaultLocation={activeTrip.currentLocation}
          onSubmit={(payload) => handleIncident({ ...payload, tripId: activeTrip._id || activeTrip.id })}
        />
      ) : null}
    </main>
  );
};

export default RiderDashboardPage;
