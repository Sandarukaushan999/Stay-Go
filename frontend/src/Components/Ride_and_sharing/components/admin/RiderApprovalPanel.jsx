import React from 'react';
import AppButton from '../common/AppButton';

const RiderApprovalPanel = ({ riders = [], onApprove }) => {
  const pending = riders.filter((rider) => !rider.isVerified);

  return (
    <section className="panel">
      <h3>Pending Rider Approvals</h3>
      {pending.length === 0 ? <p>No pending riders.</p> : null}
      <div className="list-grid">
        {pending.map((rider) => (
          <article key={rider._id || rider.id} className="panel">
            <h4>{rider.name}</h4>
            <p>{rider.email}</p>
            <p>{rider.vehicleType} - {rider.vehicleNumber}</p>
            <AppButton onClick={() => onApprove?.(rider)}>Approve Rider</AppButton>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RiderApprovalPanel;
