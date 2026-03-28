import React from 'react';
import Layout from './common/Layout';
import StatCard from './common/StatCard';
import StatusBadge from './common/StatusBadge';
import { riderStats } from './common/sampleData';

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { key: 'deliveries', label: 'My Deliveries', icon: '🚚' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

const deliveryData = [
  { id: 1, pickup: 'Hostel A', drop: 'Library', status: 'Picked' },
  { id: 2, pickup: 'Cafeteria', drop: 'Room 204', status: 'Delivered' },
  { id: 3, pickup: 'Reception', drop: 'Room 101', status: 'Pending' },
];

const RiderDashboard = () => (
  <Layout sidebarItems={sidebarItems} profile={{ name: 'Rider' }}>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {riderStats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="font-bold mb-4">Delivery List</div>
      <div className="space-y-4">
        {deliveryData.map((d) => (
          <div key={d.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <div>
              <div className="font-semibold">Pickup: <span className="text-blue-600">{d.pickup}</span></div>
              <div className="font-semibold">Drop: <span className="text-green-600">{d.drop}</span></div>
            </div>
            <StatusBadge status={d.status} />
            <div className="space-x-2">
              {d.status === 'Pending' && <button className="bg-blue-500 text-white px-3 py-1 rounded">Accept</button>}
              {d.status === 'Picked' && <button className="bg-green-500 text-white px-3 py-1 rounded">Delivered</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

export default RiderDashboard;
