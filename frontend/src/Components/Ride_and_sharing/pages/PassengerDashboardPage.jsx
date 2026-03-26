import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppButton from '../components/common/AppButton';
import NearbyRidersList from '../components/passenger/NearbyRidersList';
import PassengerTripStatus from '../components/passenger/PassengerTripStatus';
import PickupSelectionPanel from '../components/passenger/PickupSelectionPanel';
import RideRequestCard from '../components/passenger/RideRequestCard';
import RideSearchPanel from '../components/passenger/RideSearchPanel';
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

const PassengerDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { calculateRoute, loading: routeLoading } = useMapRoute();

  const [searchForm, setSearchForm] = useState({
    campusId: user?.campusId || CAMPUSES[0].id,
    femaleOnly: false,
  });
  const [pickupLocation, setPickupLocation] = useState(
    user?.pickupLocation?.lat ? user.pickupLocation : CAMPUSES[0].location
  );
  const [destination, setDestination] = useState(CAMPUSES[0].location);
  const [riders, setRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);
  const [rides, setRides] = useState([]);
  const [selectedRideDetail, setSelectedRideDetail] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeRide = useMemo(
    () => rides.find((ride) => ['requested', 'accepted', 'started', 'overdue'].includes(ride.status)) || null,
    [rides]
  );

  useEffect(() => {
    async function load() {
      try {
        const myRides = await listMyRideRequests();
        setRides(myRides);

        if (myRides[0]?._id) {
          const detail = await fetchRideById(myRides[0]._id);
          setSelectedRideDetail(detail);
        }
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    load();
  }, []);

  const refreshRides = async () => {
    const myRides = await listMyRideRequests();
    setRides(myRides);

    if (myRides[0]?._id) {
      const detail = await fetchRideById(myRides[0]._id);
      setSelectedRideDetail(detail);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchNearbyRiders({
        campusId: searchForm.campusId,
        lat: pickupLocation?.lat,
        lng: pickupLocation?.lng,
        femaleOnly: searchForm.femaleOnly,
      });
      setRiders(data);
    } catch (searchError) {
      setError(searchError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRide = async () => {
    if (!pickupLocation || !destination) {
      setError('Pickup and destination must be selected.');
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
      await refreshRides();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRide = async (ride) => {
    await cancelRideRequest(ride._id || ride.id);
    await refreshRides();
  };

  const handleUnsafe = async (ride) => {
    await reportRiderUnsafe(ride._id || ride.id);
    alert('Unsafe behavior report submitted.');
  };

  const selectedCampus = CAMPUSES.find((campus) => campus.id === searchForm.campusId);

  return (
    <main className="page-shell">
      <section className="panel page-header">
        <h1>Passenger Dashboard</h1>
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

      <RideSearchPanel form={searchForm} onChange={setSearchForm} onSearch={handleSearch} loading={loading} />
      <PickupSelectionPanel pickupLocation={pickupLocation} onSelect={(coords) => setPickupLocation({ ...coords, addressText: 'Selected pickup' })} />

      <section className="panel">
        <h3>Destination Campus</h3>
        <select
          className="app-input"
          value={searchForm.campusId}
          onChange={(event) => {
            const campusId = event.target.value;
            setSearchForm((prev) => ({ ...prev, campusId }));
            const selected = CAMPUSES.find((campus) => campus.id === campusId);
            if (selected) {
              setDestination(selected.location);
            }
          }}
        >
          {CAMPUSES.map((campus) => (
            <option key={campus.id} value={campus.id}>
              {campus.name}
            </option>
          ))}
        </select>
        <p>Destination: {selectedCampus?.location?.addressText || 'N/A'}</p>
      </section>

      <NearbyRidersList
        riders={riders}
        selectedRiderId={selectedRider?.id}
        onSelect={(rider) => setSelectedRider(rider)}
      />

      <section className="panel">
        <AppButton onClick={handleRequestRide} disabled={loading || routeLoading}>
          {loading || routeLoading ? 'Requesting...' : 'Request Ride'}
        </AppButton>
      </section>

      <RideRouteMap
        origin={pickupLocation}
        destination={destination}
        routeCoordinates={selectedRideDetail?.ride?.routeGeometry || []}
      />

      <RideRequestCard ride={activeRide} onCancel={handleCancelRide} onUnsafe={handleUnsafe} />

      <PassengerTripStatus
        trip={selectedRideDetail?.trip || null}
        onSos={(trip) => navigate(`/trip/active/${trip._id || trip.id}`)}
      />

      {selectedRideDetail?.trip ? (
        <AppButton onClick={() => navigate(`/trip/active/${selectedRideDetail.trip._id || selectedRideDetail.trip.id}`)}>
          Track Active Trip
        </AppButton>
      ) : null}
    </main>
  );
};

export default PassengerDashboardPage;
