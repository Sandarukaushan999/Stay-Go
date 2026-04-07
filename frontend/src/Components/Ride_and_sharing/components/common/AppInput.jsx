import React from 'react';

const AppInput = ({ label, error, as = 'input', className = '', ...props }) => {
  const Component = as;

  return (
    <label className={`app-field ${className}`.trim()}>
      {label ? <span className="app-field-label">{label}</span> : null}
      <Component className={`app-input${error ? ' is-invalid' : ''}`} aria-invalid={Boolean(error)} {...props} />
      {error ? <span className="app-field-error">{error}</span> : null}
    </label>
  );
};

export default AppInput;
