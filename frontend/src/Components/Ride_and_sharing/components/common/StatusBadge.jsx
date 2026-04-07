import React from 'react';
import { formatStatusLabel } from '../../utils/formatters';

const StatusBadge = ({ status = 'unknown' }) => {
  return <span className={`status-badge status-${status}`}>{formatStatusLabel(status)}</span>;
};

export default StatusBadge;
