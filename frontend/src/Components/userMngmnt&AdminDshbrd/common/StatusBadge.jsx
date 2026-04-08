import React from 'react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  inprogress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  delivered: 'bg-lime-100 text-lime-800',
  default: 'bg-gray-100 text-gray-800',
};

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status?.toLowerCase()] || statusColors.default}`}>{status}</span>
);

export default StatusBadge;
