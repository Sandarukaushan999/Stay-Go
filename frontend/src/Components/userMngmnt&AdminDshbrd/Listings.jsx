// Example: Listings.jsx
import React from 'react';

const Listings = () => (
  <div className="bg-white rounded shadow p-4">
    <h2 className="text-xl font-bold mb-4">Manage Listings</h2>
    <table className="min-w-full table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">Title</th>
          <th className="px-4 py-2">Price</th>
          <th className="px-4 py-2">User</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {/* Example row */}
        <tr>
          <td className="border px-4 py-2">Laptop</td>
          <td className="border px-4 py-2">$500</td>
          <td className="border px-4 py-2">John Doe</td>
          <td className="border px-4 py-2">
            <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">Approve</button>
            <button className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
          </td>
        </tr>
        {/* Add more rows dynamically */}
      </tbody>
    </table>
  </div>
);

export default Listings;
