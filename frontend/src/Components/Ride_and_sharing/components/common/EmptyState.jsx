import React from 'react';

const EmptyState = ({ title, description }) => {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
    </div>
  );
};

export default EmptyState;
