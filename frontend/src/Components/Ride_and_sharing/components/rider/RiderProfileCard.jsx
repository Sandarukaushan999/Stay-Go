import React from 'react';

const RiderProfileCard = ({ rider }) => {
  if (!rider) return null;

  return (
    <article className="panel">
      <h3>Rider Profile</h3>
      <p>{rider.name}</p>
      <p>{rider.email}</p>
      <p>{rider.contactNumber}</p>
      <p>{rider.vehicleType} - {rider.vehicleNumber}</p>
      <p>Seats: {rider.seatCount}</p>
      <p>Verified: {rider.isVerified ? 'Yes' : 'Pending'}</p>
      <p>Status: {rider.isOnline ? 'Online' : 'Offline'}</p>
    </article>
  );
};

export default RiderProfileCard;
