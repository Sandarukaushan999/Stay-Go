import React from 'react';

const AppButton = ({ type = 'button', variant = 'primary', className = '', children, ...props }) => {
  return (
    <button type={type} className={`app-button ${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};

export default AppButton;
