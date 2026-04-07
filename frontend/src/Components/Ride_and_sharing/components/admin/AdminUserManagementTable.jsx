import React from 'react';
import AppButton from '../common/AppButton';

function formatDate(value) {
  const parsed = Date.parse(value || '');

  if (!Number.isFinite(parsed)) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(parsed));
}

function formatEmergencyContact(user) {
  const name = user?.emergencyContact?.name || '';
  const phone = user?.emergencyContact?.phone || '';

  if (!name && !phone) {
    return '-';
  }

  if (!name) {
    return phone;
  }

  if (!phone) {
    return name;
  }

  return `${name} (${phone})`;
}

const AdminUserManagementTable = ({ users = [], role = 'rider', onEdit, onDelete }) => {
  const isRider = role === 'rider';

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Campus</th>
            <th>Student ID</th>
            {isRider ? <th>Vehicle</th> : <th>Emergency Contact</th>}
            {isRider ? <th>Seat Count</th> : null}
            {isRider ? <th>Availability</th> : null}
            <th>Verified</th>
            <th>Blocked</th>
            <th>Registered At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id || user.id}>
              <td>{user.name || '-'}</td>
              <td>{user.email || '-'}</td>
              <td>{user.contactNumber || '-'}</td>
              <td>{user.campusId || '-'}</td>
              <td>{user.studentId || '-'}</td>
              {isRider ? <td>{user.vehicleType || user.vehicleNumber || '-'}</td> : <td>{formatEmergencyContact(user)}</td>}
              {isRider ? <td>{Number.isFinite(Number(user.seatCount)) ? Number(user.seatCount) : '-'}</td> : null}
              {isRider ? <td>{user.availability || '-'}</td> : null}
              <td>{user.isVerified ? 'Yes' : 'No'}</td>
              <td>{user.isBlocked ? 'Yes' : 'No'}</td>
              <td>{formatDate(user.createdAt)}</td>
              <td>
                <div className="admin-table-actions">
                  <AppButton variant="secondary" onClick={() => onEdit?.(user)}>
                    Edit
                  </AppButton>
                  <AppButton variant="danger" onClick={() => onDelete?.(user)}>
                    Delete
                  </AppButton>
                </div>
              </td>
            </tr>
          ))}

          {users.length === 0 ? (
            <tr>
              <td colSpan={isRider ? 12 : 10}>
                <p className="empty-state">No registered {isRider ? 'riders' : 'passengers'} found.</p>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManagementTable;
