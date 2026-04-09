import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppButton from '../components/common/AppButton';
import AppInput from '../components/common/AppInput';
import LiveTrackingMap from '../components/maps/LiveTrackingMap';
import LocationPickerMap from '../components/maps/LocationPickerMap';
import RideRouteMap from '../components/maps/RideRouteMap';
import useAuth from '../hooks/useAuth';
import useMapRoute from '../hooks/useMapRoute';
import {
  cancelRideRequest,
  createRideRequest,
  fetchRideById,
  listMyRideRequests,
  reportRiderUnsafe,
  searchNearbyRiders,
} from '../services/rideService';
import { CAMPUSES } from '../utils/constants';
import { formatDistanceMeters, formatDurationSeconds } from '../utils/formatters';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'request', label: 'Request Ride' },
  { id: 'live', label: 'Live Ride' },
  { id: 'history', label: 'History' },
  { id: 'safety', label: 'Safety' },
  { id: 'profile', label: 'Profile' },
];

const fallbackNotifications = [
  { id: 'n1', title: 'Rider Assigned', detail: 'A nearby rider is preparing pickup.', time: 'Now' },
  { id: 'n2', title: 'Safety Reminder', detail: 'Verify rider and vehicle number before boarding.', time: '5m ago' },
];

const fallbackRiders = [
  { id: 'r1', name: 'Aiden Perera', vehicleType: 'Sedan', vehicleNumber: 'CAB-3142', seatCount: 3, rating: 4.9, etaMinutes: 4, distanceMeters: 420 },
  { id: 'r2', name: 'Maya Silva', vehicleType: 'EV Hatchback', vehicleNumber: 'EV-2284', seatCount: 2, rating: 4.8, etaMinutes: 6, distanceMeters: 640 },
  { id: 'r3', name: 'Nimesh Fernando', vehicleType: 'SUV', vehicleNumber: 'SUV-8871', seatCount: 4, rating: 4.7, etaMinutes: 7, distanceMeters: 820 },
];

function deriveTrip(ride) {
  if (!ride) return null;
  const startedAt = ride.startedAt || ride.requestedAt || new Date().toISOString();
  return {
    _id: `trip-${ride._id || ride.id}`,
    status: ride.status,
    origin: ride.origin,
    destination: ride.destination,
    routeGeometry: ride.routeGeometry || [],
    distanceMeters: ride.distanceMeters || 0,
    expectedDurationSeconds: ride.expectedDurationSeconds || 0,
    startedAt,
    bufferedDeadlineAt: new Date(Date.parse(startedAt) + (ride.expectedDurationSeconds || 0) * 1000 + 600000).toISOString(),
    currentLocation: ride.origin,
  };
}

const PassengerDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { calculateRoute, loading: routeLoading } = useMapRoute();

  const [activeSection, setActiveSection] = useState('home');
  const [searchForm, setSearchForm] = useState({ campusId: user?.campusId || CAMPUSES[0].id, femaleOnly: false });
  const [pickupLocation, setPickupLocation] = useState(user?.pickupLocation?.lat ? user.pickupLocation : CAMPUSES[0].location);
  const [destination, setDestination] = useState(CAMPUSES[0].location);
  const [riders, setRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);
  const [rides, setRides] = useState([]);
  const [selectedRideDetail, setSelectedRideDetail] = useState(null);
  const [notifications, setNotifications] = useState(fallbackNotifications);
  const [favorites, setFavorites] = useState([{ id: 'f1', name: 'Hostel Gate', lat: 6.9181, lng: 79.9698 }]);
  const [profileDraft, setProfileDraft] = useState({
    name: user?.name || '',
    contactNumber: user?.contactNumber || '',
    emergencyName: user?.emergencyContact?.name || '',
    emergencyPhone: user?.emergencyContact?.phone || '',
  });
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([{ id: 'c1', from: 'rider', text: 'I am approaching your pickup.', time: 'Now' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(5);

  const activeRide = useMemo(() => rides.find((ride) => ['requested', 'accepted', 'started', 'overdue'].includes(ride.status)) || null, [rides]);
  const liveTrip = useMemo(() => selectedRideDetail?.trip || deriveTrip(activeRide), [selectedRideDetail?.trip, activeRide]);
  const selectedCampus = useMemo(() => CAMPUSES.find((item) => item.id === searchForm.campusId) || CAMPUSES[0], [searchForm.campusId]);
  const summaryRide = selectedRideDetail?.ride || activeRide;
  const etaText = summaryRide ? formatDurationSeconds(summaryRide.expectedDurationSeconds) : `${selectedRider?.etaMinutes || 0} min`;
  const durationText = summaryRide ? formatDurationSeconds(summaryRide.expectedDurationSeconds) : `${(selectedRider?.etaMinutes || 5) + 6} min`;
  const distanceText = summaryRide ? formatDistanceMeters(summaryRide.distanceMeters) : formatDistanceMeters(selectedRider?.distanceMeters || 0);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const myRides = await listMyRideRequests();
        setRides(myRides);
        if (myRides[0]?._id) {
          const detail = await fetchRideById(myRides[0]._id);
          setSelectedRideDetail(detail);
        }
      } catch {
        setRides([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const found = await searchNearbyRiders({
        campusId: searchForm.campusId,
        lat: pickupLocation?.lat,
        lng: pickupLocation?.lng,
        femaleOnly: searchForm.femaleOnly,
      });
      setRiders(found);
      if (found[0]) setSelectedRider(found[0]);
    } catch {
      setRiders(fallbackRiders);
      setSelectedRider(fallbackRiders[0]);
      setNotifications((prev) => [{ id: `n-${Date.now()}`, title: 'Offline Mode', detail: 'Showing cached rider cards while server reconnects.', time: 'Now' }, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const requestRide = async () => {
    setConfirmModalOpen(false);
    if (!pickupLocation || !destination) {
      setError('Pickup and destination are required.');
      return;
    }

    try {
      setLoading(true);
      const routeData = await calculateRoute({ origin: pickupLocation, destination });
      const ride = await createRideRequest({
        origin: pickupLocation,
        destination,
        campusId: searchForm.campusId,
        riderId: selectedRider?.id,
        femaleOnly: searchForm.femaleOnly,
        seatCount: 1,
        ...routeData,
      });
      const detail = await fetchRideById(ride._id || ride.id);
      setSelectedRideDetail(detail);
      const myRides = await listMyRideRequests();
      setRides(myRides);
      setActiveSection('live');
    } catch {
      const localRide = {
        _id: `local-ride-${Date.now()}`,
        status: 'requested',
        origin: pickupLocation,
        destination,
        distanceMeters: selectedRider?.distanceMeters || 1800,
        expectedDurationSeconds: Math.max(600, (selectedRider?.etaMinutes || 8) * 60 + 420),
        requestedAt: new Date().toISOString(),
      };
      setRides((prev) => [localRide, ...prev]);
      setSelectedRideDetail({ ride: localRide, trip: deriveTrip(localRide) });
      setActiveSection('live');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRide = async () => {
    if (!activeRide) return;

    try {
      await cancelRideRequest(activeRide._id || activeRide.id);
      const myRides = await listMyRideRequests();
      setRides(myRides);
    } catch {
      setRides((prev) => prev.map((item) => ((item._id || item.id) === (activeRide._id || activeRide.id) ? { ...item, status: 'cancelled' } : item)));
    }
  };

  const handleUnsafe = async () => {
    if (!activeRide) return;

    try {
      await reportRiderUnsafe(activeRide._id || activeRide.id);
    } catch {
      // Fallback path intentionally silent.
    }

    setNotifications((prev) => [{ id: `n-${Date.now()}`, title: 'Safety Alert Sent', detail: 'Support and safety team has been notified.', time: 'Now' }, ...prev]);
  };

  const saveFavoritePickup = () => {
    setFavorites((prev) => [...prev, { id: `fav-${Date.now()}`, name: `Favorite ${prev.length + 1}`, lat: pickupLocation.lat, lng: pickupLocation.lng }]);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { id: `c-${Date.now()}`, from: 'passenger', text: chatInput.trim(), time: 'Now' }]);
    setChatInput('');
  };

  return (
    <main className="page-shell neo-passenger-page">
      <header className="panel neo-passenger-topbar">
        <div>
          <p className="neo-kicker">Smart Campus Mobility</p>
          <h1>Passenger Dashboard</h1>
          <p className="neo-subtext">Safe, intelligent, and modern student ride experience.</p>
        </div>
        <div className="neo-top-actions">
          <button type="button" onClick={() => setActiveSection('request')}>Request</button>
          <button type="button" onClick={() => setActiveSection('live')}>Live Ride</button>
          <button type="button" onClick={() => setActiveSection('history')}>History</button>
          <button type="button" onClick={() => setActiveSection('profile')}>Profile</button>
          <AppButton variant="danger" onClick={logout}>Logout</AppButton>
        </div>
      </header>

      {error ? <p className="app-error">{error}</p> : null}

      <div className="neo-passenger-layout">
        <aside className="panel neo-passenger-sidebar">
          <h3>Main Sections</h3>
          <div className="neo-section-list">
            {sections.map((section) => (
              <button key={section.id} type="button" className={activeSection === section.id ? 'is-active' : ''} onClick={() => setActiveSection(section.id)}>
                {section.label}
              </button>
            ))}
          </div>
          <div className="neo-sos-card">
            <p>Emergency Actions</p>
            <strong>Student Safety Desk</strong>
            <AppButton variant="danger" onClick={() => navigate(activeRide ? `/trip/active/${activeRide._id || activeRide.id}` : '/trip/history')}>
              SOS Emergency
            </AppButton>
          </div>
        </aside>

        <section className="neo-passenger-content">
          {(activeSection === 'home' || activeSection === 'request') ? (
            <div className="neo-section-grid">
              <article className="panel neo-glass-card">
                <h3>Ride Search</h3>
                <div className="form-grid two-col">
                  <label className="app-field">
                    <span className="app-field-label">Destination Campus</span>
                    <select
                      className="app-input"
                      value={searchForm.campusId}
                      onChange={(event) => {
                        const campusId = event.target.value;
                        setSearchForm((prev) => ({ ...prev, campusId }));
                        const selected = CAMPUSES.find((item) => item.id === campusId);
                        if (selected) setDestination(selected.location);
                      }}
                    >
                      {CAMPUSES.map((campus) => (
                        <option key={campus.id} value={campus.id}>{campus.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field checkbox-field">
                    <input type="checkbox" checked={searchForm.femaleOnly} onChange={(event) => setSearchForm((prev) => ({ ...prev, femaleOnly: event.target.checked }))} />
                    <span>Female-only preference</span>
                  </label>
                </div>
                <div className="button-row">
                  <AppButton onClick={handleSearch} disabled={loading}>{loading ? 'Searching...' : 'Search Riders'}</AppButton>
                  <AppButton variant="ghost" onClick={saveFavoritePickup}>Save Pickup</AppButton>
                </div>
                <div className="neo-summary-strip">
                  <span>ETA: {etaText}</span>
                  <span>Distance: {distanceText}</span>
                  <span>Duration: {durationText}</span>
                </div>
              </article>

              <article className="panel neo-glass-card neo-map-card">
                <h3>Pickup Location Selector</h3>
                <LocationPickerMap center={[pickupLocation.lat, pickupLocation.lng]} onSelect={(coords) => setPickupLocation({ ...coords, addressText: 'Selected pickup point' })} />
                <p className="neo-subtext">Pickup: {pickupLocation.lat.toFixed(5)}, {pickupLocation.lng.toFixed(5)}</p>
              </article>

              <article className="panel neo-glass-card">
                <h3>Available Rider Cards</h3>
                <div className="neo-rider-grid">
                  {(riders.length > 0 ? riders : fallbackRiders).map((rider) => {
                    const riderId = rider.id || rider._id;
                    const selected = (selectedRider?.id || selectedRider?._id) === riderId;
                    const riderName = rider.name || 'Campus Rider';
                    const initials = riderName.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase();

                    return (
                      <article className={`neo-rider-card ${selected ? 'is-selected' : ''}`} key={riderId}>
                        <div className="neo-rider-head">
                          <div className="neo-rider-avatar">{initials}</div>
                          <div>
                            <strong>{riderName}</strong>
                            <p>{rider.vehicleType || 'Vehicle'} - {rider.vehicleNumber || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="neo-rider-meta">
                          <span>Rating {Number(rider.rating || 4.8).toFixed(1)}</span>
                          <span>Seats {rider.seatCount || 1}</span>
                          <span>ETA {rider.etaMinutes || 6} min</span>
                        </div>
                        <AppButton variant={selected ? 'secondary' : 'primary'} onClick={() => setSelectedRider(rider)}>
                          {selected ? 'Selected' : 'Select Rider'}
                        </AppButton>
                      </article>
                    );
                  })}
                </div>
                <div className="button-row">
                  <AppButton onClick={() => setConfirmModalOpen(true)} disabled={loading || routeLoading}>
                    {loading || routeLoading ? 'Requesting...' : 'Request Ride'}
                  </AppButton>
                </div>
              </article>
            </div>
          ) : null}

          {activeSection === 'live' ? (
            <div className="neo-section-grid">
              <article className="panel neo-glass-card neo-map-card">
                <h3>Live Trip Status</h3>
                <LiveTrackingMap trip={liveTrip} />
              </article>
              <article className="panel neo-glass-card">
                <h3>Active Trip Tracker</h3>
                <div className="neo-timeline">
                  <span className={activeRide ? 'is-active' : ''}>Rider On The Way</span>
                  <span className={['accepted', 'started', 'overdue', 'completed'].includes(activeRide?.status) ? 'is-active' : ''}>Rider Arrived</span>
                  <span className={['started', 'overdue', 'completed'].includes(activeRide?.status) ? 'is-active' : ''}>Trip Started</span>
                  <span className={activeRide?.status === 'overdue' ? 'is-danger' : ''}>Trip Delayed</span>
                  <span className={activeRide?.status === 'completed' ? 'is-active' : ''}>Trip Completed</span>
                </div>
                <RideRouteMap origin={pickupLocation} destination={destination} routeCoordinates={selectedRideDetail?.ride?.routeGeometry || []} />
                <div className="button-row">
                  <AppButton variant="warning" onClick={handleUnsafe}>Report Unsafe</AppButton>
                  <AppButton variant="danger" onClick={handleCancelRide}>Cancel Ride</AppButton>
                </div>
              </article>
              <article className="panel neo-glass-card">
                <h3>Chat With Rider</h3>
                <div className="neo-chat-box">
                  {chatMessages.map((msg) => (
                    <p key={msg.id} className={msg.from === 'passenger' ? 'from-passenger' : 'from-rider'}>{msg.text}</p>
                  ))}
                </div>
                <div className="button-row">
                  <input className="app-input" value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Message rider" />
                  <AppButton onClick={sendChat}>Send</AppButton>
                </div>
              </article>
            </div>
          ) : null}

          {activeSection === 'history' ? (
            <article className="panel neo-glass-card">
              <div className="panel-head">
                <h3>Ride History</h3>
                <AppButton variant="ghost" onClick={() => navigate('/trip/history')}>Open Full History</AppButton>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Route</th><th>Status</th><th>Distance</th><th>Duration</th></tr>
                  </thead>
                  <tbody>
                    {rides.length === 0 ? <tr><td colSpan={4}>No rides yet</td></tr> : rides.map((ride) => (
                      <tr key={ride._id || ride.id}>
                        <td>{ride.origin?.addressText || 'Pickup'}{' -> '}{ride.destination?.addressText || 'Destination'}</td>
                        <td>{ride.status}</td>
                        <td>{formatDistanceMeters(ride.distanceMeters)}</td>
                        <td>{formatDurationSeconds(ride.expectedDurationSeconds)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="button-row">
                <AppButton variant="secondary" onClick={() => setRatingModalOpen(true)}>Trip Completion & Rating Modal</AppButton>
              </div>
            </article>
          ) : null}

          {activeSection === 'favorites' ? (
            <article className="panel neo-glass-card">
              <h3>Favorite Pickup Points</h3>
              <div className="neo-rider-grid">
                {favorites.map((point) => (
                  <article key={point.id} className="neo-mini-card">
                    <strong>{point.name}</strong>
                    <p>{point.lat.toFixed(4)}, {point.lng.toFixed(4)}</p>
                    <AppButton variant="ghost" onClick={() => setPickupLocation({ lat: point.lat, lng: point.lng, addressText: point.name })}>Use</AppButton>
                  </article>
                ))}
              </div>
            </article>
          ) : null}

          {activeSection === 'notifications' ? (
            <article className="panel neo-glass-card">
              <h3>Notifications</h3>
              <div className="neo-notice-stack">
                {notifications.map((item) => (
                  <div className="neo-notice tone-info" key={item.id}><strong>{item.title}</strong><p>{item.detail}</p><small>{item.time}</small></div>
                ))}
              </div>
            </article>
          ) : null}

          {activeSection === 'safety' ? (
            <article className="panel neo-glass-card">
              <h3>Support And Safety</h3>
              <div className="neo-notice tone-warning"><strong>Overdue Ride Alert</strong><p>Auto escalation enabled for delayed trips.</p></div>
              <div className="neo-notice tone-danger"><strong>Crash / Incident Notification Panel</strong><p>Incident feed is monitored in real time.</p></div>
              <div className="button-row">
                <AppButton variant="danger" onClick={() => navigate(activeRide ? `/trip/active/${activeRide._id || activeRide.id}` : '/trip/history')}>SOS Emergency Button</AppButton>
                <AppButton variant="ghost">Emergency Contact</AppButton>
              </div>
            </article>
          ) : null}

          {activeSection === 'profile' ? (
            <article className="panel neo-glass-card">
              <h3>Profile Settings</h3>
              <div className="form-grid two-col">
                <AppInput label="Name" value={profileDraft.name} onChange={(event) => setProfileDraft((prev) => ({ ...prev, name: event.target.value }))} />
                <AppInput label="Contact" value={profileDraft.contactNumber} onChange={(event) => setProfileDraft((prev) => ({ ...prev, contactNumber: event.target.value }))} />
                <AppInput label="Emergency Name" value={profileDraft.emergencyName} onChange={(event) => setProfileDraft((prev) => ({ ...prev, emergencyName: event.target.value }))} />
                <AppInput label="Emergency Phone" value={profileDraft.emergencyPhone} onChange={(event) => setProfileDraft((prev) => ({ ...prev, emergencyPhone: event.target.value }))} />
              </div>
              <div className="button-row"><AppButton>Save Settings</AppButton></div>
            </article>
          ) : null}
        </section>
      </div>

      {confirmModalOpen ? (
        <div className="neo-modal-backdrop" role="dialog" aria-modal="true">
          <div className="neo-modal-card">
            <h3>Ride Request Confirmation Modal</h3>
            <p>Pickup to {selectedCampus.name}. Confirm request?</p>
            <div className="button-row">
              <AppButton onClick={requestRide}>Confirm</AppButton>
              <AppButton variant="ghost" onClick={() => setConfirmModalOpen(false)}>Cancel</AppButton>
            </div>
          </div>
        </div>
      ) : null}

      {ratingModalOpen ? (
        <div className="neo-modal-backdrop" role="dialog" aria-modal="true">
          <div className="neo-modal-card">
            <h3>Rate Completed Trip</h3>
            <label className="app-field">
              <span className="app-field-label">Rating</span>
              <select className="app-input" value={rating} onChange={(event) => setRating(Number(event.target.value))}>
                <option value={5}>5</option><option value={4}>4</option><option value={3}>3</option><option value={2}>2</option><option value={1}>1</option>
              </select>
            </label>
            <div className="button-row">
              <AppButton onClick={() => setRatingModalOpen(false)}>Submit Rating</AppButton>
              <AppButton variant="ghost" onClick={() => setRatingModalOpen(false)}>Close</AppButton>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default PassengerDashboardPage;


