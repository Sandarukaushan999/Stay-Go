// Example: Messages.jsx
import React from 'react';

const Messages = () => (
  <div className="bg-white rounded shadow p-4">
    <h2 className="text-xl font-bold mb-4">Messages / Inquiries</h2>
    <table className="min-w-full table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">From</th>
          <th className="px-4 py-2">Message</th>
          <th className="px-4 py-2">Date</th>
        </tr>
      </thead>
      <tbody>
        {/* Example row */}
        <tr>
          <td className="border px-4 py-2">Jane Smith</td>
          <td className="border px-4 py-2">Is this item still available?</td>
          <td className="border px-4 py-2">2026-03-24</td>
        </tr>
        {/* Add more rows dynamically */}
      </tbody>
    </table>
  </div>
);

export default Messages;
