import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// ── Animated stat card ────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent, delay = 0 }) {
  return (
    <motion.div
      className={`rounded-[24px] p-6 flex flex-col gap-2 shadow-sm ${accent ? 'bg-[#BAF91A]/10 border border-[#BAF91A]/20' : 'bg-white/5 border border-white/10'}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${accent ? 'text-[#BAF91A]' : 'text-gray-400'}`}>
        <span>{icon}</span>{label}
      </div>
      <div className={`text-3xl font-light ${accent ? 'text-[#101312]' : 'text-white'}`}>{value}</div>
    </motion.div>
  );
}

// ── Role badge ────────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const map = {
    admin:      { color: 'bg-purple-100 text-purple-700',    label: 'Admin' },
    student:    { color: 'bg-blue-100 text-blue-700',        label: 'Student' },
    rider:      { color: 'bg-green-100 text-green-700',      label: 'Rider' },
    technician: { color: 'bg-orange-100 text-orange-700',    label: 'Technician' },
    technitian: { color: 'bg-orange-100 text-orange-700',    label: 'Technician' },
  };
  const { color, label } = map[role] || { color: 'bg-gray-100 text-gray-600', label: role || 'User' };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${color}`}>{label}</span>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [summary, setSummary] = useState({
    users: 0, rooms: 0, bookings: 0, rides: 0,
    roomsOccupied: 0, pendingRequests: 0, activeRiders: 0,
  });
  const [recentUsers, setRecentUsers]   = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    // Fetch summary counts
    async function fetchSummary() {
      try {
        const [roomsRes, usersRes] = await Promise.all([
          fetch('http://localhost:5000/api/rooms').catch(() => null),
          fetch('http://localhost:5000/api/users').catch(() => null),
        ]);

        const rooms = roomsRes?.ok ? await roomsRes.json() : [];
        const users = usersRes?.ok ? await usersRes.json() : [];

        setSummary(prev => ({
          ...prev,
          users: Array.isArray(users) ? users.length : 0,
          rooms: Array.isArray(rooms) ? rooms.length : 0,
          roomsOccupied: Array.isArray(rooms) ? rooms.filter(r => r.occupied).length : 0,
        }));
      } catch (_) {}
    }

    // Fetch recent users for the activity table
    async function fetchRecentUsers() {
      setLoadingUsers(true);
      try {
        const res = await fetch('http://localhost:5000/api/users');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // Show all registered users (latest first)
            setRecentUsers([...data].reverse());
          }
        }
      } catch (_) {}
      setLoadingUsers(false);
    }

    fetchSummary();
    fetchRecentUsers();
  }, []);

  // ── Chart data ────────────────────────────────────────────────────────────
  const occupied   = summary.roomsOccupied || 0;
  const available  = Math.max(0, (summary.rooms || 0) - occupied);

  const roomPieData = {
    labels: ['Occupied', 'Available'],
    datasets: [{
      data: occupied + available > 0 ? [occupied, available] : [1, 1],
      backgroundColor: ['#876DFF', '#BAF91A'],
      borderWidth: 0,
    }],
  };

  const maintenanceBarData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      { label: 'Resolved', data: [12, 19, 3, 5, 2, 3],  backgroundColor: '#BAF91A', borderRadius: 6 },
      { label: 'Pending',  data: [2,  3,  20, 5, 1, 4],  backgroundColor: '#101312', borderRadius: 6 },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  const pieOptions = {
    plugins: { legend: { display: false } },
    cutout: '72%',
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 font-[Inter,sans-serif]">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Analytical Board</h1>
          <p className="text-gray-400 text-sm mt-0.5">Welcome back — here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-900 transition">
            📅
          </button>
          <div className="bg-white border border-gray-100 rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 shadow-sm cursor-pointer hover:bg-gray-50 transition">
            Select Date <span className="text-gray-400 text-xs">▼</span>
          </div>
        </div>
      </div>

      {/* ── Dark hero card ── */}
      <motion.div
        className="bg-[#101312] rounded-[32px] p-8 relative overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(186,249,26,0.12),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-sm">
            <h2 className="text-white text-xl font-bold mb-1 tracking-wide">StayGo Core Metrics</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Real-time platform overview — users, rooms, and ride activity at a glance.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <StatCard icon="👥" label="Total Users"   value={(summary.users  || 0).toLocaleString()} delay={0.0} />
            <StatCard icon="🚗" label="Active Riders"  value={(summary.activeRiders || 0).toLocaleString()} accent delay={0.1} />
            <StatCard icon="🎫" label="Open Requests"  value={(summary.pendingRequests || 0).toLocaleString()} delay={0.2} />
          </div>
        </div>
      </motion.div>

      {/* ── Middle cards row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Room Occupancy Donut */}
        <motion.div
          className="bg-white rounded-[28px] p-7 shadow-sm border border-gray-100 flex flex-col"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <span className="w-2.5 h-2.5 rounded-full bg-[#BAF91A] inline-block" /> Room Occupancy
            </div>
            <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-lg">Live</span>
          </div>

          <div className="flex-1 flex items-center justify-center py-4 relative">
            <div className="w-[160px] h-[160px]">
              <Pie data={roomPieData} options={pieOptions} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-900">{occupied}</span>
              <span className="text-xs text-gray-400 mt-0.5">Occupied</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-2 text-xs font-semibold text-gray-500">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#876DFF]" /> Occupied</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#BAF91A]" /> Available</div>
          </div>

          {/* Quick stats below */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-gray-50">
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-gray-900">{summary.rooms || 0}</div>
              <div className="text-xs text-gray-400">Total Rooms</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-[#876DFF]">{available}</div>
              <div className="text-xs text-gray-400">Available</div>
            </div>
          </div>
        </motion.div>

        {/* Maintenance Pulse Bar Chart */}
        <motion.div
          className="bg-[#E2FF99] rounded-[28px] p-7 shadow-sm flex flex-col relative overflow-hidden"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-white/30 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-5 relative z-10">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <span>📊</span> Maintenance Pulse
            </div>
            <span className="text-xs text-gray-500 font-medium bg-white/60 px-2 py-1 rounded-lg">01-07 Jan</span>
          </div>

          <div className="flex-1 relative z-10 min-h-[120px]">
            <Bar data={maintenanceBarData} options={barOptions} />
          </div>

          <div className="flex justify-between items-center mt-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <span className="w-3 h-3 rounded-sm bg-[#BAF91A] inline-block" /> Resolved
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <span className="w-3 h-3 rounded-sm bg-[#101312] inline-block" /> Pending
              </div>
            </div>
            <div className="flex gap-2">
              <div className="bg-white/70 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-800 shadow-sm">
                Resolved <span className="text-[#876DFF]">42</span>
              </div>
              <div className="bg-[#101312] px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg">
                Pending <span className="text-[#BAF91A]">{summary.pendingRequests || 24}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Recent Activity Table (real DB data) ── */}
      <motion.div
        className="bg-white rounded-[28px] p-7 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-lg">
            <span className="text-[#BAF91A] text-xl">✦</span> Recent Users
          </div>
          <span className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1.5 rounded-lg">
            {recentUsers.length} registered
          </span>
        </div>

        {loadingUsers ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-100 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                  <div className="h-2.5 bg-gray-50 rounded w-1/3" />
                </div>
                <div className="h-5 bg-gray-100 rounded w-16" />
              </div>
            ))}
          </div>
        ) : recentUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">👥</div>
            <p className="font-semibold">No users found</p>
            <p className="text-sm mt-1">Users will appear here once they register.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-50">
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Username</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Phone</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user, idx) => (
                  <motion.tr
                    key={user._id || idx}
                    className="border-b border-gray-50/70 hover:bg-gray-50/60 transition"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    {/* Avatar + Full Name */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E2FF99] to-[#BAF91A] flex items-center justify-center font-bold text-sm text-[#101312] shrink-0">
                          {(user.fullName || user.username || 'U')[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">
                          {user.fullName || user.username || '—'}
                        </span>
                      </div>
                    </td>

                    {/* Username */}
                    <td className="py-3.5 text-gray-500 text-sm">{user.username || '—'}</td>

                    {/* Email */}
                    <td className="py-3.5 text-gray-500 text-sm">
                      {user.email ? (
                        <span className="truncate max-w-[160px] block">{user.email}</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* Role badge */}
                    <td className="py-3.5">
                      <RoleBadge role={user.role} />
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 text-gray-500 text-sm">
                      {user.phone || <span className="text-gray-300">—</span>}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 text-right">
                      <span className="inline-flex items-center gap-1.5 bg-[#BAF91A]/10 text-green-700 font-bold text-xs px-2.5 py-1 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                        Active
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

    </div>
  );
};

export default AdminDashboard;
