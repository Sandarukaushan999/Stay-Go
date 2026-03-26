import React from 'react';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';
import { MAP_DEFAULTS } from '../../utils/constants';
import { ensureLeafletMarkerIcon } from '../../utils/leafletIcon';
import 'leaflet/dist/leaflet.css';

ensureLeafletMarkerIcon();

const RideRouteMap = ({ origin, destination, routeCoordinates = [] }) => {
  if (!origin || !destination) {
    return <p>Select both origin and destination to view route.</p>;
  }

  return (
    <MapContainer center={[origin.lat, origin.lng]} zoom={13} className="map-container">
      <TileLayer attribution={MAP_DEFAULTS.attribution} url={MAP_DEFAULTS.tileUrl} />
      <Marker position={[origin.lat, origin.lng]} />
      <Marker position={[destination.lat, destination.lng]} />
      {routeCoordinates.length > 0 ? <Polyline positions={routeCoordinates} /> : null}
    </MapContainer>
  );
};

export default RideRouteMap;
