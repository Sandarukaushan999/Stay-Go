import React, { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { MAP_DEFAULTS } from '../../utils/constants';
import { ensureLeafletMarkerIcon } from '../../utils/leafletIcon';
import 'leaflet/dist/leaflet.css';

ensureLeafletMarkerIcon();

const ClickMarker = ({ onSelect }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(event) {
      const coords = {
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      };
      setPosition(coords);
      onSelect?.(coords);
    },
  });

  if (!position) return null;
  return <Marker position={[position.lat, position.lng]} />;
};

const LocationPickerMap = ({ center = MAP_DEFAULTS.center, onSelect }) => {
  return (
    <MapContainer center={center} zoom={MAP_DEFAULTS.zoom} className="map-container">
      <TileLayer attribution={MAP_DEFAULTS.attribution} url={MAP_DEFAULTS.tileUrl} />
      <ClickMarker onSelect={onSelect} />
    </MapContainer>
  );
};

export default LocationPickerMap;
