import React, { useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';
import { MAP_DEFAULTS } from '../../utils/constants';
import { ensureLeafletMarkerIcon } from '../../utils/leafletIcon';
import bikeImage from '../../assets/bike.png';
import passengerImage from '../../assets/pasenger.png';
import locationImage from '../../assets/location.png';
import 'leaflet/dist/leaflet.css';

ensureLeafletMarkerIcon();

const riderMarkerIcon = new L.Icon({
  iconUrl: bikeImage,
  iconSize: [38, 38],
  iconAnchor: [19, 30],
  popupAnchor: [0, -24],
});

const passengerMarkerIcon = new L.Icon({
  iconUrl: passengerImage,
  iconSize: [36, 36],
  iconAnchor: [18, 29],
  popupAnchor: [0, -24],
});

const destinationMarkerIcon = new L.Icon({
  iconUrl: locationImage,
  iconSize: [34, 34],
  iconAnchor: [17, 29],
  popupAnchor: [0, -24],
});

function toLatLng(point) {
  if (!point || typeof point.lat !== 'number' || typeof point.lng !== 'number') {
    return null;
  }

  return [point.lat, point.lng];
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

function nearestRouteIndex(route, point) {
  if (!Array.isArray(route) || route.length === 0 || !point) return 0;

  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  route.forEach((position, index) => {
    const [lat, lng] = position;
    const distance = haversineMeters({ lat, lng }, point);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

const RideRouteMap = ({
  origin,
  destination,
  routeCoordinates = [],
  riderLocation = null,
  passengerLocation = null,
  pickupRouteCoordinates = [],
  dropoffRouteCoordinates = [],
  isPassengerPickedUp = false,
  showRiderTracking = false,
}) => {
  const pickupPoint = passengerLocation || origin;
  const riderPoint = riderLocation || origin;

  const fallbackRoute =
    Array.isArray(routeCoordinates) && routeCoordinates.length > 0
      ? routeCoordinates
      : [toLatLng(origin || riderPoint), toLatLng(destination)].filter(Boolean);

  const pickupRoute =
    Array.isArray(pickupRouteCoordinates) && pickupRouteCoordinates.length > 0
      ? pickupRouteCoordinates
      : [toLatLng(riderPoint), toLatLng(pickupPoint)].filter(Boolean);

  const dropoffRoute =
    Array.isArray(dropoffRouteCoordinates) && dropoffRouteCoordinates.length > 0
      ? dropoffRouteCoordinates
      : Array.isArray(routeCoordinates) && routeCoordinates.length > 0
        ? routeCoordinates
        : [toLatLng(pickupPoint), toLatLng(destination)].filter(Boolean);

  const remainingPickupRoute = useMemo(() => {
    if (!showRiderTracking || isPassengerPickedUp || pickupRoute.length === 0 || !riderPoint) {
      return pickupRoute;
    }

    const nearestIndex = nearestRouteIndex(pickupRoute, riderPoint);
    const sliced = pickupRoute.slice(nearestIndex);

    return [toLatLng(riderPoint), ...sliced].filter(Boolean);
  }, [isPassengerPickedUp, pickupRoute, riderPoint, showRiderTracking]);

  const centerPoint = riderPoint || pickupPoint || destination;
  const passengerReached = haversineMeters(riderPoint, pickupPoint) < 35;
  const showPickupRoute = showRiderTracking && !isPassengerPickedUp && !passengerReached;
  const showDropoffRoute = !showRiderTracking || isPassengerPickedUp || passengerReached;

  if (!pickupPoint || !destination || !centerPoint) {
    return <p>Select both pickup and destination to view route.</p>;
  }

  return (
    <MapContainer center={toLatLng(centerPoint)} zoom={14} className="map-container">
      <TileLayer attribution={MAP_DEFAULTS.attribution} url={MAP_DEFAULTS.tileUrl} />

      {pickupPoint ? <Marker position={toLatLng(pickupPoint)} icon={passengerMarkerIcon} /> : null}
      {destination ? <Marker position={toLatLng(destination)} icon={destinationMarkerIcon} /> : null}
      {showRiderTracking && riderPoint ? <Marker position={toLatLng(riderPoint)} icon={riderMarkerIcon} /> : null}

      {!showRiderTracking && fallbackRoute.length > 0 ? (
        <Polyline positions={fallbackRoute} pathOptions={{ color: '#7d67ed', weight: 4, opacity: 0.9 }} />
      ) : null}

      {showPickupRoute && remainingPickupRoute.length > 1 ? (
        <Polyline positions={remainingPickupRoute} pathOptions={{ color: '#7d67ed', weight: 5, opacity: 0.95 }} />
      ) : null}

      {showDropoffRoute && dropoffRoute.length > 1 ? (
        <Polyline
          positions={dropoffRoute}
          pathOptions={{
            color: '#b1e51d',
            weight: 5,
            opacity: 0.95,
            dashArray: isPassengerPickedUp || passengerReached ? undefined : '8 8',
          }}
        />
      ) : null}
    </MapContainer>
  );
};

export default RideRouteMap;
