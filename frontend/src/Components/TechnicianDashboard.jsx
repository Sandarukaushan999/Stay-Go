import React from 'react';
import Layout from './common/Layout';
import StatCard from './common/StatCard';
import Table from './common/Table';
import { technicianStats } from './common/sampleData';
import StatusBadge from './common/StatusBadge';

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { key: 'tasks', label: 'My Tasks', icon: '🛠️' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

const taskData = [
  { id: 1, task: 'Fix AC', priority: 'High', status: 'Pending' },
  { id: 2, task: 'Repair Light', priority: 'Medium', status: 'InProgress' },
  { id: 3, task: 'Plumbing', priority: 'Low', status: 'Completed' },
];

const columns = [
  { key: 'task', title: 'Task' },
  { key: 'priority', title: 'Priority' },
  { key: 'status', title: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

const TechnicianDashboard = () => (
  <Layout sidebarItems={sidebarItems} profile={{ name: 'Technician' }}>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {technicianStats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="font-bold mb-4">Task List</div>
      <Table columns={columns} data={taskData} />
    </div>
  </Layout>
);

export default TechnicianDashboard;
