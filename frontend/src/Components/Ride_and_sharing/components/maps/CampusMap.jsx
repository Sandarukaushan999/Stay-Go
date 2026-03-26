import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { MAP_DEFAULTS } from '../../utils/constants';
import { ensureLeafletMarkerIcon } from '../../utils/leafletIcon';
import 'leaflet/dist/leaflet.css';

ensureLeafletMarkerIcon();

const CampusMap = ({ campuses = [], center = MAP_DEFAULTS.center }) => {
  return (
    <MapContainer center={center} zoom={13} className="map-container">
      <TileLayer attribution={MAP_DEFAULTS.attribution} url={MAP_DEFAULTS.tileUrl} />
      {campuses.map((campus) => (
        <Marker key={campus.id} position={[campus.location.lat, campus.location.lng]}>
          <Popup>{campus.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CampusMap;
