import React from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { MAP_DEFAULTS } from '../../utils/constants';
import { ensureLeafletMarkerIcon } from '../../utils/leafletIcon';
import universityIconImage from '../../../../assets/uni.png';
import 'leaflet/dist/leaflet.css';

ensureLeafletMarkerIcon();

const campusMarkerIcon = L.icon({
  iconUrl: universityIconImage,
  iconRetinaUrl: universityIconImage,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const CampusMap = ({ campuses = [], center = MAP_DEFAULTS.center }) => {
  return (
    <MapContainer center={center} zoom={13} className="map-container">
      <TileLayer attribution={MAP_DEFAULTS.attribution} url={MAP_DEFAULTS.tileUrl} />
      {campuses.map((campus) => (
        <Marker key={campus.id} position={[campus.location.lat, campus.location.lng]} icon={campusMarkerIcon}>
          <Popup>{campus.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CampusMap;
