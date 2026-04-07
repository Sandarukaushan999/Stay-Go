import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppButton from '../components/common/AppButton';
import RideRouteMap from '../components/maps/RideRouteMap';
import useAuth from '../hooks/useAuth';
import {
  createRideRequest,
  fetchRideById,
  listMyRideRequests,
  searchNearbyRiders,
  triggerRideRequestSos,
} from '../services/rideService';
import { pushSafetyAlert } from '../services/safetyAlertService';
import { joinTripRoom, leaveTripRoom, onTripLocation, sendTripSos } from '../services/trackingService';
import { CAMPUSES } from '../utils/constants';
import { formatDistanceMeters, formatDurationSeconds } from '../utils/formatters';

const FARE_PER_KM = 100;
const OVERDUE_BUFFER_MINUTES = 10;
const SOS_MESSAGE_MAX_LENGTH = 180;

function getRideId(ride) {
  return ride?._id || ride?.id || '';
}

function toPoint(point, fallback = null) {
  if (!point || typeof point.lat !== 'number' || typeof point.lng !== 'number') {
    return fallback;
  }

  return {
    lat: Number(point.lat),
    lng: Number(point.lng),
    addressText: point.addressText || '',
  };
}

function deriveTrip(ride) {
  if (!ride) return null;

  const startedAt = ride.startedAt || ride.acceptedAt || ride.requestedAt || new Date().toISOString();

  return {
    _id: ride.tripId || `trip-${getRideId(ride)}`,
    status: ride.status,
    origin: ride.origin,
    destination: ride.destination,
    routeGeometry: ride.routeGeometry || [],
    distanceMeters: ride.distanceMeters || 0,
    expectedDurationSeconds: ride.expectedDurationSeconds || 0,
    startedAt,
    currentLocation: ride.currentLocation || ride.origin,
  };
}

function etaMinutes(rider) {
  const value = Number(rider?.etaMinutes || rider?.eta || rider?.arrivalMinutes || 0);
  return Number.isFinite(value) && value > 0 ? value : 999;
}

function riderDistanceMeters(rider) {
  const value = Number(rider?.distanceMeters || rider?.distance || 0);
  return Number.isFinite(value) ? value : 0;
}

function rankRiders(list = []) {
  return [...list].sort(
    (left, right) => etaMinutes(left) - etaMinutes(right) || riderDistanceMeters(left) - riderDistanceMeters(right)
  );
}

function calculateFare(distanceMeters) {
  const km = Math.max(0, Number(distanceMeters || 0) / 1000);
  return Math.max(FARE_PER_KM, Math.round(km * FARE_PER_KM));
}

function formatLkr(value) {
  return `LKR ${Number(value || 0).toLocaleString('en-LK')}`;
}

function formatEtaClock(seconds) {
  if (!seconds) return 'N/A';
  const etaDate = new Date(Date.now() + Number(seconds) * 1000);
  return etaDate.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' });
}

function rideStatusText(status) {
  if (status === 'requested') return 'Rider on the way';
  if (status === 'accepted') return 'Rider accepted request';
  if (status === 'started') return 'Trip started';
  if (status === 'overdue') return 'Trip delayed';
  if (status === 'completed') return 'Trip completed';
  return 'Waiting for request';
}

const PassengerDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [pickupLocation, setPickupLocation] = useState(
    user?.pickupLocation?.lat ? user.pickupLocation : { ...CAMPUSES[0].location, addressText: 'Current location' }
  );
  const [campusId, setCampusId] = useState(user?.campusId || CAMPUSES[0].id);
  const [riders, setRiders] = useState([]);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [rides, setRides] = useState([]);
  const [selectedRideDetail, setSelectedRideDetail] = useState(null);
  const [liveRiderLocation, setLiveRiderLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminPrompt, setAdminPrompt] = useState('');
  const [overduePromptRideId, setOverduePromptRideId] = useState('');
  const [sosBusy, setSosBusy] = useState(false);
  const [sosMessage, setSosMessage] = useState('');

  const activeRide = useMemo(
    () => rides.find((ride) => ['requested', 'accepted', 'started', 'overdue'].includes(ride.status)) || null,
    [rides]
  );

  const selectedCampus = useMemo(
    () => CAMPUSES.find((campus) => campus.id === campusId) || CAMPUSES[0],
    [campusId]
  );

  const rankedRiders = useMemo(() => rankRiders(riders), [riders]);

  const selectedRider = useMemo(() => {
    if (selectedRiderId) {
      const exact = rankedRiders.find((item) => String(item.id || item._id) === String(selectedRiderId));
      if (exact) {
        return exact;
      }
    }

    return rankedRiders[0] || null;
  }, [rankedRiders, selectedRiderId]);

  const summaryRide = selectedRideDetail?.ride || activeRide;
  const activeTrip = selectedRideDetail?.trip || deriveTrip(activeRide);
  const activeTripId = activeTrip?._id || activeRide?.tripId || null;

  const riderLocationPoint =
    toPoint(liveRiderLocation) ||
    toPoint(activeTrip?.currentLocation) ||
    toPoint(summaryRide?.currentLocation) ||
    toPoint(summaryRide?.origin);

  const destinationPoint = toPoint(summaryRide?.destination, toPoint(selectedCampus.location));
  const originPoint = toPoint(summaryRide?.origin, toPoint(pickupLocation));

  const passengerPickedUp = ['started', 'overdue', 'completed'].includes(summaryRide?.status);
  const distanceMeters = Number(summaryRide?.distanceMeters || selectedRider?.distanceMeters || 0);
  const durationSeconds = Number(summaryRide?.expectedDurationSeconds || Math.max(480, etaMinutes(selectedRider) * 60 + 420));
  const fareAmount = calculateFare(distanceMeters);

  const etaToRider = selectedRider ? `${Math.max(1, etaMinutes(selectedRider))} min` : 'N/A';
  const destinationEta = formatEtaClock(durationSeconds);
  const statusLabel = rideStatusText(summaryRide?.status);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPickupLocation((previous) => ({
          ...previous,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          addressText: 'Current location',
        }));
      },
      () => {
        // Keep fallback location.
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 10000,
      }
    );
  }, []);

  useEffect(() => {
    async function loadRides() {
      try {
        setLoading(true);
        const myRides = await listMyRideRequests();
        setRides(myRides);

        if (myRides[0]?._id) {
          const detail = await fetchRideById(myRides[0]._id);
          setSelectedRideDetail(detail);
          if (detail?.trip?.currentLocation) {
            setLiveRiderLocation(toPoint(detail.trip.currentLocation));
          }
        }
      } catch (requestError) {
        setError(requestError?.message || 'Unable to load your rides.');
        setRides([]);
      } finally {
        setLoading(false);
      }
    }

    loadRides();
  }, []);

  useEffect(() => {
    if (!selectedRider && rankedRiders[0]) {
      setSelectedRiderId(String(rankedRiders[0].id || rankedRiders[0]._id));
    }
  }, [rankedRiders, selectedRider]);

  useEffect(() => {
    if (!activeTripId) {
      return undefined;
    }

    joinTripRoom(activeTripId);

    const unsubscribe = onTripLocation((payload) => {
      if (String(payload.tripId) !== String(activeTripId)) {
        return;
      }

      const nextLocation = {
        lat: Number(payload.lat),
        lng: Number(payload.lng),
        addressText: payload.addressText || 'Rider live location',
        updatedAt: payload.updatedAt,
      };

      setLiveRiderLocation(nextLocation);
      setSelectedRideDetail((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          trip: {
            ...(previous.trip || {}),
            _id: previous.trip?._id || activeTripId,
            currentLocation: nextLocation,
          },
        };
      });
    });

    return () => {
      leaveTripRoom(activeTripId);
      unsubscribe?.();
    };
  }, [activeTripId]);

  useEffect(() => {
    if (!summaryRide || !['started', 'overdue'].includes(summaryRide.status)) {
      setAdminPrompt('');
      return;
    }

    const rideId = String(getRideId(summaryRide));

    const checkOverdue = () => {
      const startedAt = Date.parse(
        activeTrip?.startedAt || summaryRide.startedAt || summaryRide.requestedAt || ''
      );
      const expectedMs = Number(summaryRide.expectedDurationSeconds || 0) * 1000;

      if (!Number.isFinite(startedAt) || startedAt <= 0 || expectedMs <= 0) {
        return;
      }

      const dueAt = startedAt + expectedMs + OVERDUE_BUFFER_MINUTES * 60 * 1000;

      if (Date.now() <= dueAt || overduePromptRideId === rideId) {
        return;
      }

      const message = 'Are You ok';
      setAdminPrompt(message);
      setOverduePromptRideId(rideId);

      pushSafetyAlert({
        type: 'overdue-check',
        title: 'Overdue Ride Safety Check',
        location: summaryRide.destination?.addressText || selectedCampus.name,
        level: 'high',
        message,
        passengerName: user?.name || 'Passenger',
      });
    };

    checkOverdue();
    const timer = window.setInterval(checkOverdue, 15000);

    return () => {
      window.clearInterval(timer);
    };
  }, [activeTrip?.startedAt, overduePromptRideId, selectedCampus.name, summaryRide, user?.name]);

  const handleSearchRiders = async () => {
    try {
      setLoading(true);
      setError('');
      const found = await searchNearbyRiders({
        campusId,
        lat: pickupLocation?.lat,
        lng: pickupLocation?.lng,
      });

      const ranked = rankRiders(found);
      setRiders(ranked);
      if (ranked[0]) {
        setSelectedRiderId(String(ranked[0].id || ranked[0]._id));
      }
    } catch (requestError) {
      setError(requestError?.message || 'Unable to find nearby riders.');
      setRiders([]);
      setSelectedRiderId('');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRide = async () => {
    if (!pickupLocation || !selectedCampus?.location) {
      setError('Pickup and destination are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const ride = await createRideRequest({
        origin: pickupLocation,
        destination: selectedCampus.location,
        campusId,
        riderId: selectedRider?.id || selectedRider?._id,
        seatCount: 1,
      });

      const detail = await fetchRideById(getRideId(ride));
      setSelectedRideDetail(detail);
      if (detail?.trip?.currentLocation) {
        setLiveRiderLocation(toPoint(detail.trip.currentLocation));
      }

      const myRides = await listMyRideRequests();
      setRides(myRides);
    } catch (requestError) {
      setError(requestError?.message || 'Unable to request ride.');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSos = async () => {
    if (!summaryRide) {
      setError('No active ride for SOS.');
      return;
    }

    setSosBusy(true);
    setError('');

    const trimmedSosMessage = String(sosMessage || '').trim().slice(0, SOS_MESSAGE_MAX_LENGTH);
    const rideId = getRideId(summaryRide);

    try {
      if (activeTripId) {
        await sendTripSos(activeTripId, { message: trimmedSosMessage });
      } else if (rideId) {
        await triggerRideRequestSos(rideId, { message: trimmedSosMessage });
      }
    } catch (sosError) {
      setError(sosError?.message || 'Unable to send SOS to server. Local alert was still created.');
    }

    pushSafetyAlert({
      type: 'sos',
      title: 'Passenger SOS Triggered',
      location: summaryRide.origin?.addressText || summaryRide.destination?.addressText || 'Ride route',
      level: 'critical',
      message: trimmedSosMessage || 'Emergency SOS sent by passenger',
      passengerName: user?.name || 'Passenger',
    });

    setSosMessage('');
    setSosBusy(false);
  };

  return (
    <main className="page-shell passenger-simple-page">
      <header className="panel passenger-simple-header">
        <p className="ride-simple-kicker">Stay-Go Ride Sharing</p>
        <h1>Passenger Dashboard</h1>
        <p className="ride-simple-subtext">Current location, fastest rider recommendation, and live trip safety.</p>
        <div className="ride-simple-header-actions">
          <AppButton variant="ghost" onClick={handleSearchRiders} disabled={loading}>
            {loading ? 'Searching...' : 'Search Riders'}
          </AppButton>
          <AppButton variant="danger" onClick={logout}>Logout</AppButton>
        </div>
      </header>

      {loading ? <p className="ride-simple-subtext">Loading passenger dashboard...</p> : null}
      {error ? <p className="app-error">{error}</p> : null}

      <section className="panel passenger-simple-map-card">
        <div className="panel-head">
          <h3>Live Passenger Map</h3>
          <span className="workspace-chip">{statusLabel}</span>
        </div>

        <RideRouteMap
          origin={originPoint}
          destination={destinationPoint}
          routeCoordinates={summaryRide?.routeGeometry || []}
          riderLocation={riderLocationPoint}
          passengerLocation={originPoint}
          isPassengerPickedUp={passengerPickedUp}
          showRiderTracking={Boolean(riderLocationPoint || selectedRider)}
        />

        <p className="ride-simple-subtext">
          Current location: {pickupLocation.lat.toFixed(5)}, {pickupLocation.lng.toFixed(5)}
        </p>
      </section>

      <section className="panel passenger-simple-search-card">
        <div className="ride-simple-control-row">
          <label className="app-field">
            <span className="app-field-label">Destination Campus</span>
            <select className="app-input" value={campusId} onChange={(event) => setCampusId(event.target.value)}>
              {CAMPUSES.map((campus) => (
                <option key={campus.id} value={campus.id}>{campus.name}</option>
              ))}
            </select>
          </label>

          <AppButton onClick={handleRequestRide} disabled={loading || !selectedRider}>
            {loading ? 'Requesting...' : 'Request Ride'}
          </AppButton>
        </div>

        <h3>Fastest Arriving Riders</h3>
        <div className="passenger-simple-rider-list">
          {rankedRiders.map((rider, index) => {
            const riderId = String(rider.id || rider._id);
            const selected = riderId === String(selectedRider?.id || selectedRider?._id || '');

            return (
              <article key={riderId} className={`passenger-simple-rider-item ${selected ? 'is-selected' : ''}`}>
                <button type="button" className="passenger-simple-rider-select" onClick={() => setSelectedRiderId(riderId)}>
                  <span className="neo-rank-badge">{index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : 'th'} fastest</span>
                  <strong>{rider.name}</strong>
                  <p>{rider.vehicleType} - {rider.vehicleNumber}</p>
                  <div className="ride-simple-request-meta">
                    <span>ETA {Math.max(1, etaMinutes(rider))} min</span>
                    <span>{formatDistanceMeters(rider.distanceMeters)}</span>
                    <span>Seats {rider.seatCount || 1}</span>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel passenger-simple-trip-card">
        <h3>Trip Details And Payment</h3>

        <div className="ride-simple-passenger-card">
          <div>
            <span>Passenger</span>
            <strong>{user?.name || 'Passenger'}</strong>
          </div>
          <div>
            <span>University</span>
            <strong>{selectedCampus.name}</strong>
          </div>
        </div>

        <div className="ride-simple-metric-grid">
          <article>
            <span>Rider ETA</span>
            <strong>{etaToRider}</strong>
            <small>Fastest rider ranking</small>
          </article>
          <article>
            <span>Distance</span>
            <strong>{formatDistanceMeters(distanceMeters)}</strong>
            <small>{formatDurationSeconds(durationSeconds)}</small>
          </article>
          <article>
            <span>Estimated Arrival</span>
            <strong>{destinationEta}</strong>
            <small>{statusLabel}</small>
          </article>
        </div>

        <article className="ride-simple-fare-card">
          <span>Payment Rule</span>
          <strong>LKR {FARE_PER_KM} / km</strong>
          <small>Estimated payment to rider: {formatLkr(fareAmount)}</small>
        </article>

        {adminPrompt ? (
          <div className="neo-notice tone-warning">
            <strong>Admin Message</strong>
            <p>{adminPrompt}</p>
          </div>
        ) : null}

        <label className="app-field ride-simple-sos-field">
          <span className="app-field-label">SOS Description (Optional)</span>
          <textarea
            className="app-input ride-simple-sos-input"
            placeholder="Short emergency note for admin (optional)"
            value={sosMessage}
            maxLength={SOS_MESSAGE_MAX_LENGTH}
            onChange={(event) => setSosMessage(event.target.value)}
          />
          <small className="ride-simple-sos-counter">{sosMessage.length}/{SOS_MESSAGE_MAX_LENGTH}</small>
        </label>

        <div className="button-row">
          <AppButton variant="danger" onClick={handleTriggerSos} disabled={sosBusy || !summaryRide}>
            {sosBusy ? 'Sending SOS...' : 'SOS Emergency'}
          </AppButton>
          {selectedRider?.contactNumber ? (
            <a className="button app-button button-outline" href={`tel:${selectedRider.contactNumber}`}>
              Call Rider
            </a>
          ) : null}
          {summaryRide ? (
            <AppButton variant="ghost" onClick={() => navigate('/trip/history')}>Ride History</AppButton>
          ) : null}
        </div>
      </section>
    </main>
  );
};

export default PassengerDashboardPage;

