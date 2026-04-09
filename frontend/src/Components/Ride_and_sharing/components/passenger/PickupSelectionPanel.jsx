import React from 'react';
import LocationPickerMap from '../maps/LocationPickerMap';

const PickupSelectionPanel = ({ pickupLocation, onSelect }) => {
  return (
    <section className="panel">
      <h3>Pickup Selection</h3>
      <p>Click on map to set pickup location.</p>
      <LocationPickerMap
        center={pickupLocation ? [pickupLocation.lat, pickupLocation.lng] : undefined}
        onSelect={onSelect}
      />
      {pickupLocation ? (
        <p>
          Selected: {pickupLocation.lat.toFixed(5)}, {pickupLocation.lng.toFixed(5)}
        </p>
      ) : null}
    </section>
  );
};

export default PickupSelectionPanel;
