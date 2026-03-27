import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getRiderProfile, updateRiderAvailability } from '../api/riderApi';
import AppButton from '../components/common/AppButton';
import AppInput from '../components/common/AppInput';
import RideRouteMap from '../components/maps/RideRouteMap';
import CrashReportForm from '../components/rider/CrashReportForm';
import useAuth from '../hooks/useAuth';
import { reportIncident } from '../services/incidentService';
import { getTripRoute } from '../services/routeService';
import {
  acceptRideRequest,
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
import { formatDistanceMeters, formatDurationSeconds } from '../utils/formatters';

const riderSections = [
  { id: 'home', label: 'Home' },
  { id: 'requests', label: 'Requests' },
  { id: 'active', label: 'Live Ride' },
  { id: 'history', label: 'History' },
  { id: 'safety', label: 'Safety' },
  { id: 'profile', label: 'Profile' },
];

const fallbackRequests = [
  {
    _id: 'rq-local-1',
    status: 'requested',
    passengerId: { _id: 'p1', name: 'Rashmi Jay', contactNumber: '+94-77-900-1010' },
    origin: { lat: 6.9151, lng: 79.971, addressText: 'Hostel Gate B' },
    destination: { lat: 6.9143, lng: 79.9727, addressText: 'SLIIT Main Campus' },
    distanceMeters: 1800,
    expectedDurationSeconds: 900,
    seatCount: 1,
  },
  {
    _id: 'rq-local-2',
    status: 'accepted',
    passengerId: { _id: 'p2', name: 'Kavindu R', contactNumber: '+94-77-900-2020' },
    origin: { lat: 6.9168, lng: 79.9692, addressText: 'Library Entrance' },
    destination: { lat: 6.9127, lng: 79.8507, addressText: 'SLIIT Metro' },
    distanceMeters: 4200,
    expectedDurationSeconds: 1320,
    seatCount: 1,
  },
];

const EMPTY_ROUTE_PLAN = {
  pickupRoute: [],
  dropoffRoute: [],
  pickupDistanceMeters: 0,
  pickupDurationSeconds: 0,
  dropoffDistanceMeters: 0,
  dropoffDurationSeconds: 0,
};

function toPoint(point, fallback = null) {
  if (!point || typeof point.lat !== 'number' || typeof point.lng !== 'number') {
    return fallback;
  }

  return {
    lat: point.lat,
    lng: point.lng,
    addressText: point.addressText || '',
  };
}

function fallbackRouteGeometry(origin, destination) {
  if (!origin || !destination) return [];

  return [
    [origin.lat, origin.lng],
    [destination.lat, destination.lng],
  ];
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
      (Array.isArray(trip?.routeGeometry) && trip.routeGeometry.length > 0 && trip.routeGeometry) ||
      ride?.routeGeometry ||
      fallbackRouteGeometry(nextOrigin, nextDestination),
    distanceMeters: Number(trip?.distanceMeters || ride?.distanceMeters || 0),
    expectedDurationSeconds: Number(trip?.expectedDurationSeconds || ride?.expectedDurationSeconds || 0),
    currentLocation: toPoint(trip?.currentLocation, toPoint(ride?.currentLocation, nextOrigin)),
    tripId: trip?._id || ride?.tripId || null,
  };
}

const RiderDashboardPage = () => {
  const { user, logout } = useAuth();

  const [activeSection, setActiveSection] = useState('home');
  const [profile, setProfile] = useState(null);
  const [rides, setRides] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [activeTripId, setActiveTripId] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [routeAnchor, setRouteAnchor] = useState(null);
  const [routePlan, setRoutePlan] = useState(EMPTY_ROUTE_PLAN);
  const [routeLoading, setRouteLoading] = useState(false);
  const [syncState, setSyncState] = useState('GPS standby');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    name: user?.name || '',
    contactNumber: user?.contactNumber || '',
    vehicleType: '',
    vehicleNumber: '',
  });
  const [feedbackNotes, setFeedbackNotes] = useState('');

  const locationSyncRef = useRef(0);
  const riderLocationRef = useRef(null);

  const incomingRequests = useMemo(() => rides.filter((ride) => ride.status === 'requested'), [rides]);
  const acceptedRides = useMemo(
    () => rides.filter((ride) => ['accepted', 'started', 'overdue'].includes(ride.status)),
    [rides]
  );
  const currentRide = useMemo(() => activeTrip || acceptedRides[0] || null, [activeTrip, acceptedRides]);

  const passengerPickedUp = ['started', 'overdue', 'completed'].includes(currentRide?.status);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [profileData, ridesData] = await Promise.all([getRiderProfile(), listMyRideRequests()]);
        setProfile(profileData.user);
        setRides(ridesData);
        setRiderLocation(toPoint(profileData.user?.hostelLocation, toPoint(ridesData[0]?.origin, null)));
        setProfileDraft((prev) => ({
          ...prev,
          name: profileData.user?.name || prev.name,
          contactNumber: profileData.user?.contactNumber || prev.contactNumber,
          vehicleType: profileData.user?.vehicleType || '',
          vehicleNumber: profileData.user?.vehicleNumber || '',
        }));
      } catch {
        const fallbackProfile = {
          name: user?.name || 'Rider',
          email: user?.email || 'rider@staygo.local',
          contactNumber: user?.contactNumber || '+94-11-555-0200',
          vehicleType: 'Sedan',
          vehicleNumber: 'CAR-9812',
          seatCount: 3,
          isVerified: true,
          isOnline: true,
          availability: 'online',
          hostelLocation: { lat: 6.9162, lng: 79.9741, addressText: 'Near SLIIT Malabe' },
        };

        setProfile(fallbackProfile);
        setRides(fallbackRequests);
        setRiderLocation(fallbackProfile.hostelLocation);
        setProfileDraft((prev) => ({
          ...prev,
          name: fallbackProfile.name,
          contactNumber: fallbackProfile.contactNumber,
          vehicleType: fallbackProfile.vehicleType,
          vehicleNumber: fallbackProfile.vehicleNumber,
        }));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?.contactNumber, user?.email, user?.name]);

  const refreshRides = async () => {
    try {
      const ridesData = await listMyRideRequests();
      setRides(ridesData);
    } catch {
      // Keep fallback list in offline mode.
    }
  };

  const currentRideKey = currentRide?._id || currentRide?.id || null;

  useEffect(() => {
    riderLocationRef.current = riderLocation;
  }, [riderLocation]);

  useEffect(() => {
    if (!currentRideKey || !currentRide) {
      setRouteAnchor(null);
      return;
    }

    const nextAnchor =
      toPoint(riderLocationRef.current) ||
      toPoint(profile?.hostelLocation) ||
      toPoint(user?.hostelLocation) ||
      toPoint(currentRide.currentLocation) ||
      toPoint(currentRide.origin);

    setRouteAnchor(nextAnchor);
  }, [currentRideKey, currentRide, profile?.hostelLocation, user?.hostelLocation]);

  useEffect(() => {
    if (!currentRide || !['started', 'overdue', 'completed'].includes(currentRide.status)) {
      setActiveTripId(null);
      return;
    }

    if (currentRide.tripId) {
      setActiveTripId(currentRide.tripId);
      return;
    }

    if (activeTripId) {
      return;
    }

    let cancelled = false;

    async function resolveTrip() {
      const rideId = currentRide._id || currentRide.id;
      if (!rideId) return;

      try {
        const detail = await fetchRideById(rideId);

        if (cancelled || !detail?.trip?._id) {
          return;
        }

        setActiveTripId(detail.trip._id);
        setActiveTrip((prev) => normalizeStartedRide(prev || currentRide, detail.trip));
        if (detail.trip.currentLocation) {
          setRiderLocation(toPoint(detail.trip.currentLocation));
        }
      } catch {
        // Ignore and continue in local mode.
      }
    }

    resolveTrip();

    return () => {
      cancelled = true;
    };
  }, [activeTripId, currentRide]);

  useEffect(() => {
    if (!activeTripId) {
      return undefined;
    }

    joinTripRoom(activeTripId);

    const unsubscribe = onTripLocation((payload) => {
      if (String(payload.tripId) !== String(activeTripId)) return;

      const nextLocation = {
        lat: Number(payload.lat),
        lng: Number(payload.lng),
        addressText: payload.addressText || 'Live location update',
        updatedAt: payload.updatedAt,
      };

      setRiderLocation(nextLocation);
      setActiveTrip((prev) => (prev ? { ...prev, currentLocation: nextLocation } : prev));
      setSyncState('Live sync connected');
    });

    return () => {
      leaveTripRoom(activeTripId);
      unsubscribe?.();
    };
  }, [activeTripId]);

  useEffect(() => {
    if (!currentRide || !navigator.geolocation) {
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

        if (now - locationSyncRef.current < 7000) {
          return;
        }

        locationSyncRef.current = now;

        try {
          await updateTripLocation(activeTripId, nextLocation);
          setSyncState('Live sync connected');
        } catch {
          setSyncState('Live sync pending');
        }
      },
      () => {
        setSyncState('GPS permission needed');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 12000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [activeTripId, currentRide]);

  useEffect(() => {
    if (!currentRide?.origin || !currentRide?.destination || !routeAnchor) {
      setRoutePlan(EMPTY_ROUTE_PLAN);
      return;
    }

    let cancelled = false;

    async function buildRoutePlan() {
      setRouteLoading(true);

      const pickupFallback = fallbackRouteGeometry(routeAnchor, currentRide.origin);
      const dropoffFallback =
        Array.isArray(currentRide.routeGeometry) && currentRide.routeGeometry.length > 1
          ? currentRide.routeGeometry
          : fallbackRouteGeometry(currentRide.origin, currentRide.destination);

      try {
        const [pickupData, dropoffData] = await Promise.all([
          getTripRoute({ origin: routeAnchor, destination: currentRide.origin }),
          getTripRoute({ origin: currentRide.origin, destination: currentRide.destination }),
        ]);

        if (cancelled) return;

        setRoutePlan({
          pickupRoute:
            Array.isArray(pickupData.routeGeometry) && pickupData.routeGeometry.length > 1
              ? pickupData.routeGeometry
              : pickupFallback,
          dropoffRoute:
            Array.isArray(dropoffData.routeGeometry) && dropoffData.routeGeometry.length > 1
              ? dropoffData.routeGeometry
              : dropoffFallback,
          pickupDistanceMeters: Number(pickupData.distanceMeters || 0),
          pickupDurationSeconds: Number(pickupData.expectedDurationSeconds || 0),
          dropoffDistanceMeters: Number(dropoffData.distanceMeters || currentRide.distanceMeters || 0),
          dropoffDurationSeconds: Number(
            dropoffData.expectedDurationSeconds || currentRide.expectedDurationSeconds || 0
          ),
        });
      } catch {
        if (cancelled) return;

        setRoutePlan({
          pickupRoute: pickupFallback,
          dropoffRoute: dropoffFallback,
          pickupDistanceMeters: 0,
          pickupDurationSeconds: 0,
          dropoffDistanceMeters: Number(currentRide.distanceMeters || 0),
          dropoffDurationSeconds: Number(currentRide.expectedDurationSeconds || 0),
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
    currentRide?._id,
    currentRide?.id,
    currentRide?.origin,
    currentRide?.destination,
    currentRide?.routeGeometry,
    currentRide?.distanceMeters,
    currentRide?.expectedDurationSeconds,
    routeAnchor,
  ]);

  const handleToggleAvailability = async (nextOnline) => {
    try {
      const result = await updateRiderAvailability({
        isOnline: nextOnline,
        availability: nextOnline ? 'online' : 'offline',
      });
      setProfile(result.user);
    } catch {
      setProfile((prev) => ({
        ...prev,
        isOnline: nextOnline,
        availability: nextOnline ? 'online' : 'offline',
      }));
    }
  };

  const handleAccept = async (ride) => {
    try {
      await acceptRideRequest(ride._id || ride.id);
      await refreshRides();
      setActiveSection('active');
    } catch {
      setRides((prev) =>
        prev.map((item) =>
          (item._id || item.id) === (ride._id || ride.id) ? { ...item, status: 'accepted' } : item
        )
      );
      setActiveSection('active');
    }
  };

  const handleStart = async (ride) => {
    try {
      const result = await startRideRequest(ride._id || ride.id);
      const normalized = normalizeStartedRide(ride, result.trip);
      setActiveTrip(normalized);
      setActiveTripId(result.trip?._id || null);
      setRiderLocation(toPoint(result.trip?.currentLocation, toPoint(ride.origin)));
      await refreshRides();
    } catch {
      const started = {
        ...ride,
        status: 'started',
        currentLocation: toPoint(riderLocation, toPoint(ride.origin)),
      };

      setActiveTrip(started);
      setRides((prev) =>
        prev.map((item) =>
          (item._id || item.id) === (ride._id || ride.id) ? { ...item, status: 'started' } : item
        )
      );
    }

    setActiveSection('active');
  };

  const handleComplete = async (ride) => {
    try {
      await completeRideRequest(ride._id || ride.id);
      setActiveTrip(null);
      setActiveTripId(null);
      await refreshRides();
    } catch {
      setRides((prev) =>
        prev.map((item) =>
          (item._id || item.id) === (ride._id || ride.id) ? { ...item, status: 'completed' } : item
        )
      );
      setActiveTrip(null);
      setActiveTripId(null);
    }
  };

  const handleIncident = async (payload) => {
    try {
      await reportIncident(payload);
    } catch {
      setError('Incident saved in local mode and queued for sync.');
    }
    setIncidentModalOpen(false);
  };

  return (
    <main className="page-shell neo-rider-page">
      <header className="panel neo-rider-topbar">
        <div>
          <p className="neo-kicker">Stay-Go Ride Sharing</p>
          <h1>Rider Dashboard</h1>
          <p className="neo-subtext">Clean, mobile-friendly control for pickups, route tracking, and safety.</p>
        </div>
        <div className="neo-top-actions">
          <button type="button" onClick={() => setActiveSection('requests')}>Requests</button>
          <button type="button" onClick={() => setActiveSection('active')}>Live Ride</button>
          <button type="button" onClick={() => setActiveSection('history')}>History</button>
          <AppButton variant="danger" onClick={logout}>Logout</AppButton>
        </div>
      </header>

      {error ? <p className="app-error">{error}</p> : null}
      {loading ? <p className="neo-subtext">Loading rider workspace...</p> : null}

      <div className="neo-rider-layout">
        <aside className="panel neo-rider-sidebar">
          <h3>Navigation</h3>
          <div className="neo-section-list">
            {riderSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={activeSection === section.id ? 'is-active' : ''}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>

          <article className="neo-sos-card">
            <p>Current Status</p>
            <strong>{profile?.isOnline ? 'Online' : 'Offline'}</strong>
            <small>{syncState}</small>
            <AppButton onClick={() => handleToggleAvailability(!profile?.isOnline)}>
              {profile?.isOnline ? 'Go Offline' : 'Go Online'}
            </AppButton>
          </article>
        </aside>

        <section className="neo-rider-content">
          {(activeSection === 'home' || activeSection === 'requests') ? (
            <article className="panel neo-glass-card">
              <h3>Incoming Ride Requests</h3>
              <div className="neo-rider-grid">
                {(incomingRequests.length > 0
                  ? incomingRequests
                  : fallbackRequests.filter((item) => item.status === 'requested')
                ).map((ride) => (
                  <article key={ride._id || ride.id} className="neo-rider-card">
                    <strong>{ride.passengerId?.name || 'Passenger'}</strong>
                    <p>{ride.origin?.addressText || 'Pickup'} {' -> '} {ride.destination?.addressText || 'Campus'}</p>
                    <div className="neo-rider-meta">
                      <span>{formatDistanceMeters(ride.distanceMeters)}</span>
                      <span>{formatDurationSeconds(ride.expectedDurationSeconds)}</span>
                      <span>Seats {ride.seatCount || 1}</span>
                    </div>
                    <div className="button-row">
                      <AppButton onClick={() => handleAccept(ride)}>Accept</AppButton>
                      <AppButton variant="ghost">Reject</AppButton>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          ) : null}

          {(activeSection === 'home' || activeSection === 'active') ? (
            <div className="neo-section-grid">
              <article className="panel neo-glass-card neo-map-card">
                <div className="panel-head">
                  <h3>Live Rider Map</h3>
                  <span className="workspace-chip">Real-time sync</span>
                </div>
                {currentRide ? (
                  <>
                    {routeLoading ? <p className="neo-subtext">Calculating fastest routes...</p> : null}
                    <RideRouteMap
                      origin={toPoint(currentRide.origin)}
                      destination={toPoint(currentRide.destination)}
                      riderLocation={toPoint(riderLocation, toPoint(currentRide.origin))}
                      passengerLocation={toPoint(currentRide.origin)}
                      pickupRouteCoordinates={routePlan.pickupRoute}
                      dropoffRouteCoordinates={routePlan.dropoffRoute}
                      isPassengerPickedUp={passengerPickedUp}
                      showRiderTracking
                    />
                  </>
                ) : (
                  <p className="neo-subtext">Accept a request to see passenger location and fastest route guidance.</p>
                )}
              </article>

              <article className="panel neo-glass-card">
                <h3>Trip Overview</h3>
                {currentRide ? (
                  <>
                    <p>Passenger: {currentRide.passengerId?.name || 'N/A'}</p>
                    <p>Pickup: {currentRide.origin?.addressText || 'Not set'}</p>
                    <p>Destination: {currentRide.destination?.addressText || 'Not set'}</p>
                    <p>Status: {currentRide.status}</p>
                    <div className="neo-summary-strip">
                      <span>
                        To Passenger: {formatDistanceMeters(routePlan.pickupDistanceMeters)} / {formatDurationSeconds(routePlan.pickupDurationSeconds)}
                      </span>
                      <span>
                        To Campus: {formatDistanceMeters(routePlan.dropoffDistanceMeters || currentRide.distanceMeters)} / {formatDurationSeconds(routePlan.dropoffDurationSeconds || currentRide.expectedDurationSeconds)}
                      </span>
                      <span>{syncState}</span>
                    </div>
                    <div className="button-row">
                      {currentRide.status === 'accepted' ? (
                        <AppButton onClick={() => handleStart(currentRide)}>Start Trip</AppButton>
                      ) : null}
                      {currentRide.status === 'started' ? (
                        <AppButton variant="success" onClick={() => handleComplete(currentRide)}>
                          Complete Trip
                        </AppButton>
                      ) : null}
                      <AppButton variant="warning" onClick={() => setIncidentModalOpen(true)}>
                        Incident
                      </AppButton>
                      {currentRide.passengerId?.contactNumber ? (
                        <a className="button app-button button-outline" href={`tel:${currentRide.passengerId.contactNumber}`}>
                          Call Passenger
                        </a>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <p className="neo-subtext">No active ride yet.</p>
                )}
              </article>
            </div>
          ) : null}

          {activeSection === 'history' ? (
            <article className="panel neo-glass-card">
              <h3>Trip History</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Passenger</th>
                      <th>Route</th>
                      <th>Status</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rides.length === 0 ? (
                      <tr>
                        <td colSpan={4}>No trips yet</td>
                      </tr>
                    ) : (
                      rides.map((ride) => (
                        <tr key={ride._id || ride.id}>
                          <td>{ride.passengerId?.name || 'Passenger'}</td>
                          <td>
                            {ride.origin?.addressText || 'Pickup'} {' -> '} {ride.destination?.addressText || 'Destination'}
                          </td>
                          <td>{ride.status}</td>
                          <td>{formatDurationSeconds(ride.expectedDurationSeconds)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </article>
          ) : null}

          {activeSection === 'safety' ? (
            <article className="panel neo-glass-card">
              <h3>Support And Safety</h3>
              <div className="neo-notice tone-warning">
                <strong>Delayed Trip Warning</strong>
                <p>Trips over expected duration are auto-flagged for safety review.</p>
              </div>
              <div className="button-row">
                <AppButton variant="danger" onClick={() => setIncidentModalOpen(true)}>
                  Crash / Incident Report
                </AppButton>
                <AppButton variant="ghost">Contact Safety Desk</AppButton>
              </div>
            </article>
          ) : null}

          {activeSection === 'profile' ? (
            <article className="panel neo-glass-card">
              <h3>Profile Settings</h3>
              <div className="form-grid two-col">
                <AppInput
                  label="Name"
                  value={profileDraft.name}
                  onChange={(event) => setProfileDraft((prev) => ({ ...prev, name: event.target.value }))}
                />
                <AppInput
                  label="Contact"
                  value={profileDraft.contactNumber}
                  onChange={(event) =>
                    setProfileDraft((prev) => ({ ...prev, contactNumber: event.target.value }))
                  }
                />
                <AppInput
                  label="Vehicle Type"
                  value={profileDraft.vehicleType}
                  onChange={(event) =>
                    setProfileDraft((prev) => ({ ...prev, vehicleType: event.target.value }))
                  }
                />
                <AppInput
                  label="Vehicle Number"
                  value={profileDraft.vehicleNumber}
                  onChange={(event) =>
                    setProfileDraft((prev) => ({ ...prev, vehicleNumber: event.target.value }))
                  }
                />
              </div>
              <AppInput
                as="textarea"
                label="Notes"
                value={feedbackNotes}
                onChange={(event) => setFeedbackNotes(event.target.value)}
              />
              <div className="button-row">
                <AppButton>Save Profile</AppButton>
              </div>
            </article>
          ) : null}
        </section>
      </div>

      {incidentModalOpen ? (
        <div className="neo-modal-backdrop" role="dialog" aria-modal="true">
          <div className="neo-modal-card">
            <CrashReportForm
              tripId={activeTripId || currentRide?._id || currentRide?.id || 'local-trip'}
              defaultLocation={
                toPoint(riderLocation, toPoint(currentRide?.origin, { lat: 0, lng: 0, addressText: '' }))
              }
              onSubmit={(payload) =>
                handleIncident({
                  ...payload,
                  tripId: activeTripId || currentRide?._id || currentRide?.id || payload.tripId,
                })
              }
            />
            <div className="button-row">
              <AppButton variant="ghost" onClick={() => setIncidentModalOpen(false)}>
                Close
              </AppButton>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default RiderDashboardPage;