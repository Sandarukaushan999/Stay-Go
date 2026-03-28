import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getRiderProfile, updateRiderAvailability } from '../api/riderApi';
import AppButton from '../components/common/AppButton';
import RideRouteMap from '../components/maps/RideRouteMap';
import useAuth from '../hooks/useAuth';
import { getTripRoute } from '../services/routeService';
import {
  acceptRideRequest,
  cancelRideRequest,
  completeRideRequest,
  fetchRideById,
  listMyRideRequests,
  startRideRequest,
} from '../services/rideService';
import {
  joinTripRoom,
  leaveTripRoom,
  onTripLocation,
  updateTripLocation,
} from '../services/trackingService';
import { CAMPUSES } from '../utils/constants';
import { formatDistanceMeters, formatDurationSeconds } from '../utils/formatters';

const FARE_PER_KM = 100;

const EMPTY_ROUTE_PLAN = {
  pickupRoute: [],
  dropoffRoute: [],
  pickupDistanceMeters: 0,
  pickupDurationSeconds: 0,
  dropoffDistanceMeters: 0,
  dropoffDurationSeconds: 0,
};

const DROP_OFF_STATUSES = new Set(['started', 'overdue', 'completed']);

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

function fallbackRoute(origin, destination) {
  if (!origin || !destination) {
    return [];
  }

  return [
    [origin.lat, origin.lng],
    [destination.lat, destination.lng],
  ];
}

function pointSignature(point) {
  const normalized = toPoint(point);
  if (!normalized) {
    return '';
  }

  return `${normalized.lat.toFixed(5)},${normalized.lng.toFixed(5)}`;
}

function haversineMeters(a, b) {
  if (!a || !b) return 0;

  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371000;
  const deltaLat = toRadians(b.lat - a.lat);
  const deltaLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  return 2 * earthRadius * Math.asin(Math.sqrt(h));
}

function calculateFare(distanceMeters) {
  const km = Math.max(0, Number(distanceMeters || 0) / 1000);
  return Math.max(FARE_PER_KM, Math.round(km * FARE_PER_KM));
}

function formatLkr(value) {
  return `LKR ${Number(value || 0).toLocaleString('en-LK')}`;
}

function formatEtaClock(totalSeconds) {
  if (!totalSeconds) return 'N/A';

  const eta = new Date(Date.now() + Number(totalSeconds) * 1000);
  return eta.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' });
}

function resolveUniversityName(ride) {
  if (!ride) {
    return 'University not selected';
  }

  if (ride.campusId) {
    const campus = CAMPUSES.find((item) => item.id === ride.campusId);
    if (campus) {
      return campus.name;
    }
  }

  return ride.destination?.addressText || 'Destination campus';
}

function normalizeStartedRide(ride, trip) {
  const nextOrigin = toPoint(trip?.origin, toPoint(ride?.origin));
  const nextDestination = toPoint(trip?.destination, toPoint(ride?.destination));

  return {
    ...ride,
    status: trip?.status === 'completed' ? 'completed' : 'started',
    origin: nextOrigin,
    destination: nextDestination,
    routeGeometry:
      (Array.isArray(trip?.routeGeometry) && trip.routeGeometry.length > 1 && trip.routeGeometry) ||
      ride?.routeGeometry ||
      fallbackRoute(nextOrigin, nextDestination),
    distanceMeters: Number(trip?.distanceMeters || ride?.distanceMeters || 0),
    expectedDurationSeconds: Number(trip?.expectedDurationSeconds || ride?.expectedDurationSeconds || 0),
    currentLocation: toPoint(trip?.currentLocation, toPoint(ride?.currentLocation, nextOrigin)),
    tripId: trip?._id || ride?.tripId || null,
  };
}

const RiderDashboardPage = () => {
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [rides, setRides] = useState([]);
  const [selectedRideId, setSelectedRideId] = useState('');
  const [activeTrip, setActiveTrip] = useState(null);
  const [activeTripId, setActiveTripId] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [routePlan, setRoutePlan] = useState(EMPTY_ROUTE_PLAN);
  const [routeLoading, setRouteLoading] = useState(false);
  const [syncState, setSyncState] = useState('GPS standby');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lastSyncRef = useRef(0);
  const [routeAnchor, setRouteAnchor] = useState(null);
  const routeAnchorKeyRef = useRef('');

  const incomingRequests = useMemo(() => rides.filter((ride) => ride.status === 'requested'), [rides]);

  const activeRides = useMemo(
    () => rides.filter((ride) => ['accepted', 'started', 'overdue'].includes(ride.status)),
    [rides]
  );

  const focusedRide = useMemo(() => {
    if (activeTrip) {
      return activeTrip;
    }

    if (selectedRideId) {
      const selected = rides.find((ride) => String(getRideId(ride)) === String(selectedRideId));
      if (selected) {
        return selected;
      }
    }

    return activeRides[0] || incomingRequests[0] || null;
  }, [activeRides, activeTrip, incomingRequests, rides, selectedRideId]);

  const riderAnchor =
    toPoint(riderLocation) ||
    toPoint(profile?.hostelLocation) ||
    toPoint(user?.hostelLocation) ||
    toPoint(focusedRide?.currentLocation) ||
    toPoint(focusedRide?.origin);

  const passengerPickedUp = DROP_OFF_STATUSES.has(focusedRide?.status);

  const pickupDistanceMeters = Number(
    passengerPickedUp
      ? 0
      : haversineMeters(riderAnchor, toPoint(focusedRide?.origin)) || routePlan.pickupDistanceMeters || 0
  );
  const destinationDistanceMeters = Number(routePlan.dropoffDistanceMeters || focusedRide?.distanceMeters || 0);
  const pickupDurationSeconds = Number(routePlan.pickupDurationSeconds || 0);
  const destinationDurationSeconds = Number(
    routePlan.dropoffDurationSeconds || focusedRide?.expectedDurationSeconds || 0
  );

  const totalArrivalSeconds = passengerPickedUp
    ? destinationDurationSeconds
    : pickupDurationSeconds + destinationDurationSeconds;

  const estimatedFare = calculateFare(destinationDistanceMeters);
  const universityName = resolveUniversityName(focusedRide);

  const flowMessage = !focusedRide
    ? 'No request selected. Waiting for passenger ride requests.'
    : focusedRide.status === 'requested'
      ? 'Passenger request received. Accept to start pickup flow.'
      : focusedRide.status === 'accepted'
        ? 'Go to passenger location and press Confirm Pickup once passenger boards.'
        : focusedRide.status === 'started'
          ? 'Passenger onboard. Follow the fastest route to destination.'
          : focusedRide.status === 'overdue'
            ? 'Trip delayed. Keep route tracking and safety monitoring active.'
            : 'Trip completed. Ready for the next request.';

  const routeRequestKey = useMemo(() => {
    const rideId = getRideId(focusedRide);
    const originKey = pointSignature(focusedRide?.origin);
    const destinationKey = pointSignature(focusedRide?.destination);

    if (!rideId || !originKey || !destinationKey) {
      return '';
    }

    const phase = DROP_OFF_STATUSES.has(focusedRide?.status) ? 'dropoff' : 'pickup';
    return `${rideId}|${phase}|${originKey}|${destinationKey}`;
  }, [
    focusedRide?._id,
    focusedRide?.destination?.lat,
    focusedRide?.destination?.lng,
    focusedRide?.id,
    focusedRide?.origin?.lat,
    focusedRide?.origin?.lng,
    focusedRide?.status,
  ]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');
        const [profileData, ridesData] = await Promise.all([getRiderProfile(), listMyRideRequests()]);

        setProfile(profileData.user);
        setRides(ridesData);
        setRiderLocation(toPoint(profileData.user?.hostelLocation, toPoint(ridesData[0]?.origin)));
      } catch (requestError) {
        setError(requestError?.message || 'Unable to load rider dashboard.');
        setProfile(null);
        setRides([]);
        setRiderLocation(null);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user?.name]);

  const refreshRides = async () => {
    try {
      const list = await listMyRideRequests();
      setRides(list);
    } catch (requestError) {
      setError(requestError?.message || 'Unable to refresh ride requests.');
    }
  };

  useEffect(() => {
    if (!focusedRide || !['started', 'overdue', 'completed'].includes(focusedRide.status)) {
      setActiveTripId(null);
      return;
    }

    if (focusedRide.tripId) {
      setActiveTripId(focusedRide.tripId);
      return;
    }

    let cancelled = false;

    async function resolveTrip() {
      const rideId = getRideId(focusedRide);
      if (!rideId) return;

      try {
        const detail = await fetchRideById(rideId);

        if (cancelled || !detail?.trip?._id) {
          return;
        }

        setActiveTripId(detail.trip._id);
        setActiveTrip((prev) => normalizeStartedRide(prev || focusedRide, detail.trip));
        if (detail.trip.currentLocation) {
          setRiderLocation(toPoint(detail.trip.currentLocation));
        }
      } catch (requestError) {
        setError(requestError?.message || 'Unable to load trip details.');
      }
    }

    resolveTrip();

    return () => {
      cancelled = true;
    };
  }, [focusedRide?._id, focusedRide?.id, focusedRide?.status, focusedRide?.tripId]);

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
        addressText: payload.addressText || 'Rider GPS',
        updatedAt: payload.updatedAt,
      };

      setRiderLocation(nextLocation);
      setSyncState('Live sync connected');
      setActiveTrip((prev) => (prev ? { ...prev, currentLocation: nextLocation } : prev));
    });

    return () => {
      leaveTripRoom(activeTripId);
      unsubscribe?.();
    };
  }, [activeTripId]);

  useEffect(() => {
    if (!focusedRide || !navigator.geolocation) {
      return undefined;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          addressText: 'Rider GPS',
        };

        setRiderLocation(nextLocation);
        setSyncState('GPS active');

        if (!activeTripId) {
          return;
        }

        const now = Date.now();
        if (now - lastSyncRef.current < 7000) {
          return;
        }

        lastSyncRef.current = now;

        try {
          await updateTripLocation(activeTripId, nextLocation);
          setSyncState('Live sync connected');
        } catch {
          setSyncState('Live sync pending');
        }
      },
      () => setSyncState('GPS permission needed'),
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [activeTripId, Boolean(focusedRide)]);

  useEffect(() => {
    if (!routeRequestKey) {
      routeAnchorKeyRef.current = '';
      setRouteAnchor(null);
      setRoutePlan(EMPTY_ROUTE_PLAN);
      setRouteLoading(false);
      return;
    }

    if (routeAnchorKeyRef.current === routeRequestKey) {
      return;
    }

    const nextAnchor = riderAnchor || toPoint(focusedRide?.origin);
    if (!nextAnchor) {
      return;
    }

    routeAnchorKeyRef.current = routeRequestKey;
    setRouteAnchor(nextAnchor);
  }, [focusedRide?.origin?.addressText, focusedRide?.origin?.lat, focusedRide?.origin?.lng, riderAnchor, routeRequestKey]);

  useEffect(() => {
    const originPoint = toPoint(focusedRide?.origin);
    const destinationPoint = toPoint(focusedRide?.destination);

    if (!routeRequestKey || !originPoint || !destinationPoint || !routeAnchor) {
      return;
    }

    let cancelled = false;
    const rideInDropoffPhase = DROP_OFF_STATUSES.has(focusedRide?.status);

    async function buildRoutePlan() {
      setRouteLoading(true);

      const pickupFallback = fallbackRoute(routeAnchor, originPoint);
      const dropoffFallback = fallbackRoute(originPoint, destinationPoint);

      try {
        const [pickupData, dropoffData] = await Promise.all([
          rideInDropoffPhase ? Promise.resolve(null) : getTripRoute({ origin: routeAnchor, destination: originPoint }),
          getTripRoute({ origin: originPoint, destination: destinationPoint }),
        ]);

        if (cancelled) {
          return;
        }

        setRoutePlan({
          pickupRoute:
            Array.isArray(pickupData?.routeGeometry) && pickupData.routeGeometry.length > 1
              ? pickupData.routeGeometry
              : pickupFallback,
          dropoffRoute:
            Array.isArray(dropoffData?.routeGeometry) && dropoffData.routeGeometry.length > 1
              ? dropoffData.routeGeometry
              : dropoffFallback,
          pickupDistanceMeters: Number(pickupData?.distanceMeters || haversineMeters(routeAnchor, originPoint) || 0),
          pickupDurationSeconds: Number(pickupData?.expectedDurationSeconds || 0),
          dropoffDistanceMeters: Number(dropoffData?.distanceMeters || focusedRide?.distanceMeters || 0),
          dropoffDurationSeconds: Number(
            dropoffData?.expectedDurationSeconds || focusedRide?.expectedDurationSeconds || 0
          ),
        });
      } catch {
        if (cancelled) {
          return;
        }

        setRoutePlan({
          pickupRoute: pickupFallback,
          dropoffRoute: dropoffFallback,
          pickupDistanceMeters: haversineMeters(routeAnchor, originPoint),
          pickupDurationSeconds: 0,
          dropoffDistanceMeters: Number(focusedRide?.distanceMeters || 0),
          dropoffDurationSeconds: Number(focusedRide?.expectedDurationSeconds || 0),
        });
      } finally {
        if (!cancelled) {
          setRouteLoading(false);
        }
      }
    }

    buildRoutePlan();

    return () => {
      cancelled = true;
    };
  }, [
    focusedRide?.distanceMeters,
    focusedRide?.expectedDurationSeconds,
    focusedRide?.status,
    routeAnchor,
    routeRequestKey,
  ]);

  const handleToggleAvailability = async () => {
    const nextOnline = !profile?.isOnline;

    try {
      const result = await updateRiderAvailability({
        isOnline: nextOnline,
        availability: nextOnline ? 'online' : 'offline',
      });
      setProfile(result.user);
    } catch (requestError) {
      setError(requestError?.message || 'Unable to update availability.');
    }
  };

  const handleAccept = async (ride) => {
    const rideId = getRideId(ride);
    if (!rideId) return;

    try {
      await acceptRideRequest(rideId);
      await refreshRides();
    } catch (requestError) {
      setError(requestError?.message || 'Unable to accept ride request.');
      return;
    }

    setSelectedRideId(String(rideId));
  };

  const handleReject = async (ride) => {
    const rideId = getRideId(ride);
    if (!rideId) return;

    try {
      await cancelRideRequest(rideId);
      await refreshRides();
    } catch (requestError) {
      setError(requestError?.message || 'Unable to reject ride request.');
    }
  };

  const handleConfirmPickup = async () => {
    if (!focusedRide) return;

    const rideId = getRideId(focusedRide);
    if (!rideId) return;

    try {
      const result = await startRideRequest(rideId);
      const normalized = normalizeStartedRide(focusedRide, result.trip);
      setActiveTrip(normalized);
      setActiveTripId(result.trip?._id || null);
      await refreshRides();
    } catch (requestError) {
      setError(requestError?.message || 'Unable to start trip.');
      return;
    }
  };

  const handleCompleteTrip = async () => {
    if (!focusedRide) return;

    const rideId = getRideId(focusedRide);
    if (!rideId) return;

    try {
      await completeRideRequest(rideId);
      setActiveTrip(null);
      setActiveTripId(null);
      await refreshRides();
    } catch (requestError) {
      setError(requestError?.message || 'Unable to complete trip.');
      return;
    }
  };

  return (
    <main className="page-shell ride-simple-page">
      <header className="panel ride-simple-header">
        <p className="ride-simple-kicker">Stay-Go Ride Sharing</p>
        <h1>Rider Dashboard</h1>
        <p className="ride-simple-subtext">Pickup confirmation, fastest route guidance, and fare visibility.</p>
        <div className="ride-simple-header-actions">
          <span className={`ride-simple-status-pill ${profile?.isOnline ? 'is-online' : 'is-offline'}`}>
            {profile?.isOnline ? 'Online' : 'Offline'}
          </span>
          <span className="ride-simple-sync">{syncState}</span>
          <AppButton variant="ghost" onClick={handleToggleAvailability}>
            {profile?.isOnline ? 'Go Offline' : 'Go Online'}
          </AppButton>
          <AppButton variant="danger" onClick={logout}>Logout</AppButton>
        </div>
      </header>

      {loading ? <p className="ride-simple-subtext">Loading rider dashboard...</p> : null}
      {error ? <p className="app-error">{error}</p> : null}

      <section className="panel ride-simple-map-card">
        <div className="panel-head">
          <h3>Live Rider Map</h3>
          <span className="workspace-chip">Real-time sync</span>
        </div>

        {focusedRide ? (
          <>
            {routeLoading ? <p className="ride-simple-subtext">Calculating fastest route...</p> : null}
            <RideRouteMap
              origin={toPoint(focusedRide.origin)}
              destination={toPoint(focusedRide.destination)}
              riderLocation={toPoint(riderLocation, toPoint(focusedRide.origin))}
              passengerLocation={toPoint(focusedRide.origin)}
              pickupRouteCoordinates={routePlan.pickupRoute}
              dropoffRouteCoordinates={routePlan.dropoffRoute}
              isPassengerPickedUp={passengerPickedUp}
              showRiderTracking
            />
          </>
        ) : (
          <p className="ride-simple-subtext">Accept a request to see passenger location and route guidance.</p>
        )}

        <p className="ride-simple-flow-note">{flowMessage}</p>
      </section>

      <section className="panel ride-simple-request-card">
        <h3>Incoming Ride Requests</h3>

        {incomingRequests.length === 0 ? (
          <p className="ride-simple-subtext">No pending passenger requests right now.</p>
        ) : (
          <div className="ride-simple-request-list">
            {incomingRequests.map((ride) => {
              const rideId = getRideId(ride);
              const isSelected = String(rideId) === String(getRideId(focusedRide));

              return (
                <article key={rideId} className={`ride-simple-request-item ${isSelected ? 'is-selected' : ''}`}>
                  <button type="button" className="ride-simple-request-select" onClick={() => setSelectedRideId(String(rideId))}>
                    <strong>{ride.passengerId?.name || 'Passenger'}</strong>
                    <p>{ride.origin?.addressText || 'Pickup'} {' -> '} {ride.destination?.addressText || 'Destination'}</p>
                    <div className="ride-simple-request-meta">
                      <span>{formatDistanceMeters(ride.distanceMeters)}</span>
                      <span>{formatDurationSeconds(ride.expectedDurationSeconds)}</span>
                      <span>Seats {ride.seatCount || 1}</span>
                    </div>
                  </button>
                  <div className="button-row">
                    <AppButton onClick={() => handleAccept(ride)}>Accept</AppButton>
                    <AppButton variant="ghost" onClick={() => handleReject(ride)}>Reject</AppButton>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel ride-simple-trip-card">
        <h3>Trip Overview</h3>

        {focusedRide ? (
          <>
            <div className="ride-simple-passenger-card">
              <div>
                <span>Passenger</span>
                <strong>{focusedRide.passengerId?.name || 'N/A'}</strong>
              </div>
              <div>
                <span>University</span>
                <strong>{universityName}</strong>
              </div>
            </div>

            <div className="ride-simple-metric-grid">
              <article>
                <span>To Passenger</span>
                <strong>{formatDistanceMeters(pickupDistanceMeters)}</strong>
                <small>{formatDurationSeconds(pickupDurationSeconds)}</small>
              </article>
              <article>
                <span>To Destination</span>
                <strong>{formatDistanceMeters(destinationDistanceMeters)}</strong>
                <small>{formatDurationSeconds(destinationDurationSeconds)}</small>
              </article>
              <article>
                <span>Estimated Arrival</span>
                <strong>{formatEtaClock(totalArrivalSeconds)}</strong>
                <small>{syncState}</small>
              </article>
            </div>

            <article className="ride-simple-fare-card">
              <span>Payment Rule</span>
              <strong>LKR {FARE_PER_KM} / km</strong>
              <small>Estimated payment: {formatLkr(estimatedFare)}</small>
            </article>

            <div className="button-row">
              {focusedRide.status === 'accepted' ? (
                <AppButton onClick={handleConfirmPickup}>Confirm Pickup</AppButton>
              ) : null}
              {focusedRide.status === 'started' ? (
                <AppButton variant="success" onClick={handleCompleteTrip}>Complete Trip</AppButton>
              ) : null}
              {focusedRide.passengerId?.contactNumber ? (
                <a className="button app-button button-outline" href={`tel:${focusedRide.passengerId.contactNumber}`}>
                  Call Passenger
                </a>
              ) : null}
            </div>
          </>
        ) : (
          <p className="ride-simple-subtext">No active ride yet.</p>
        )}
      </section>
    </main>
  );
};

export default RiderDashboardPage;

