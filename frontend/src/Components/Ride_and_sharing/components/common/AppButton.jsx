import React from 'react';

const AppButton = ({ type = 'button', variant = 'primary', className = '', children, ...props }) => {
  const variantClassMap = {
    primary: 'button-dark',
    secondary: 'button-primary',
    success: 'button-dark app-button-success',
    danger: 'button-dark app-button-danger',
    warning: 'button-outline app-button-warning',
    ghost: 'button-outline',
  };

  const variantClass = variantClassMap[variant] || 'button-dark';

  return (
    <button type={type} className={`button app-button ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};

export default AppButton;
