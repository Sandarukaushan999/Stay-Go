import React from 'react';
import AppButton from '../common/AppButton';

const UsersTable = ({ users = [], onToggleBlock }) => {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Verified</th>
            <th>Blocked</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id || user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isVerified ? 'Yes' : 'No'}</td>
              <td>{user.isBlocked ? 'Yes' : 'No'}</td>
              <td>
                <AppButton
                  variant={user.isBlocked ? 'success' : 'danger'}
                  onClick={() => onToggleBlock?.(user)}
                >
                  {user.isBlocked ? 'Unblock' : 'Block'}
                </AppButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
