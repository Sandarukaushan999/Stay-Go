// Example: Reports.jsx
import React from 'react';

const Reports = () => (
  <div className="bg-white rounded shadow p-4">
    <h2 className="text-xl font-bold mb-4">Reported Items</h2>
    <table className="min-w-full table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">Listing</th>
          <th className="px-4 py-2">Reason</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {/* Example row */}
        <tr>
          <td className="border px-4 py-2">Laptop</td>
          <td className="border px-4 py-2">Inappropriate content</td>
          <td className="border px-4 py-2">
            <button className="bg-red-500 text-white px-2 py-1 rounded mr-2">Delete</button>
            <button className="bg-gray-400 text-white px-2 py-1 rounded">Ignore</button>
          </td>
        </tr>
        {/* Add more rows dynamically */}
      </tbody>
    </table>
  </div>
);

export default Reports;
