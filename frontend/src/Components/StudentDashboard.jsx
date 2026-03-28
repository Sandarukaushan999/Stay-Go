import React from 'react';
import Layout from './common/Layout';
import StatCard from './common/StatCard';
import { studentStats } from './common/sampleData';

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { key: 'requests', label: 'My Requests', icon: '🛠️' },
  { key: 'announcements', label: 'Announcements', icon: '📢' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

const StudentDashboard = () => (
  <Layout sidebarItems={sidebarItems} profile={{ name: 'Student' }}>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {studentStats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="font-bold mb-2">Maintenance Request Status</div>
        <div className="flex gap-4">
          <StatCard label="Pending" value={1} icon="⏳" dark={false} />
          <StatCard label="In Progress" value={1} icon="🔧" dark={false} />
          <StatCard label="Completed" value={5} icon="✅" dark={false} />
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow flex flex-col">
        <div className="font-bold mb-2">Announcements</div>
        <ul className="text-gray-700 list-disc ml-5">
          <li>Hostel cleaning on Friday</li>
          <li>Fee payment deadline: 31st March</li>
        </ul>
        <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-xl self-end">Request New Service</button>
      </div>
    </div>
  </Layout>
);

export default StudentDashboard;
