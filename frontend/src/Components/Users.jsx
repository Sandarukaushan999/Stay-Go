// Example: Users.jsx
import React from 'react';

const Users = () => (
  <div className="bg-white rounded shadow p-4">
    <h2 className="text-xl font-bold mb-4">Manage Users</h2>
    <table className="min-w-full table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {/* Example row */}
        <tr>
          <td className="border px-4 py-2">John Doe</td>
          <td className="border px-4 py-2">john@example.com</td>
          <td className="border px-4 py-2">Active</td>
          <td className="border px-4 py-2">
            <button className="bg-yellow-400 text-white px-2 py-1 rounded mr-2">Block</button>
            <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </td>
        </tr>
        {/* Add more rows dynamically */}
      </tbody>
    </table>
  </div>
);

export default Users;
