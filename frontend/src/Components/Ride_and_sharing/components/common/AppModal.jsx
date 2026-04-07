import React from 'react';
import AppButton from './AppButton';

const AppModal = ({ open, title, children, onClose }) => {
  if (!open) return null;

  return (
    <div className="app-modal-overlay" role="dialog" aria-modal="true">
      <div className="app-modal">
        <div className="app-modal-header">
          <h3>{title}</h3>
          <AppButton variant="ghost" onClick={onClose}>
            Close
          </AppButton>
        </div>
        <div className="app-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default AppModal;
