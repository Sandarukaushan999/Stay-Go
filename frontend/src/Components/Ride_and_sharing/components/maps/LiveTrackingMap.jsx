import React from 'react';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';
import { MAP_DEFAULTS } from '../../utils/constants';
import { ensureLeafletMarkerIcon } from '../../utils/leafletIcon';
import 'leaflet/dist/leaflet.css';

ensureLeafletMarkerIcon();

const LiveTrackingMap = ({ trip }) => {
  if (!trip) {
    return <p>No active trip selected.</p>;
  }

  const currentLat = trip.currentLocation?.lat || trip.origin?.lat;
  const currentLng = trip.currentLocation?.lng || trip.origin?.lng;

  return (
    <MapContainer center={[currentLat, currentLng]} zoom={14} className="map-container">
      <TileLayer attribution={MAP_DEFAULTS.attribution} url={MAP_DEFAULTS.tileUrl} />
      {trip.origin ? <Marker position={[trip.origin.lat, trip.origin.lng]} /> : null}
      {trip.destination ? <Marker position={[trip.destination.lat, trip.destination.lng]} /> : null}
      {trip.currentLocation ? <Marker position={[trip.currentLocation.lat, trip.currentLocation.lng]} /> : null}
      {Array.isArray(trip.routeGeometry) && trip.routeGeometry.length > 0 ? (
        <Polyline positions={trip.routeGeometry} />
      ) : null}
    </MapContainer>
  );
};

export default LiveTrackingMap;
