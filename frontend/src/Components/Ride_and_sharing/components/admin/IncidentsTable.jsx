import React from 'react';
import { formatDateTime } from '../../utils/formatters';

const IncidentsTable = ({ incidents = [] }) => {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Incident</th>
            <th>Type</th>
            <th>Severity</th>
            <th>Trip</th>
            <th>Created By</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident._id || incident.id}>
              <td>{incident._id?.slice(-8) || incident.id?.slice(-8)}</td>
              <td>{incident.type}</td>
              <td>{incident.severity}</td>
              <td>{incident.tripId?._id?.slice(-8) || incident.tripId?.slice?.(-8) || '-'}</td>
              <td>{incident.createdBy?.name || '-'}</td>
              <td>{formatDateTime(incident.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentsTable;
