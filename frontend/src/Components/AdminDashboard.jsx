import React, { useState, useEffect } from 'react';
import Hostels from './Hostels';
import Rooms from './Rooms';
import Bookings from './Bookings';
import Rides from './Rides';
import Users from './Users';

import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const DashboardHome = ({ summary }) => {
  // Chart data (adapted to new colors)
  const maintenanceBarData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Resolved',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: '#BAF91A',
        borderRadius: 4,
      },
      {
        label: 'Open',
        data: [2, 3, 20, 5, 1, 4],
        backgroundColor: '#101312',
        borderRadius: 4,
      }
    ],
  };

  const roomPieData = {
    labels: ['Occupied', 'Available', 'Maintenance'],
    datasets: [
      {
        data: [summary.roomsOccupied || 120, ((summary.rooms || 150) - (summary.roomsOccupied || 120)) * 0.8, ((summary.rooms || 150) - (summary.roomsOccupied || 120)) * 0.2],
        backgroundColor: ['#876DFF', '#BAF91A', '#E2FF99'],
        borderWidth: 0,
      },
    ],
  };

  const recentActivity = [
    { id: 1, user: 'Quinta Starter', region: 'Block A, 101', score: '88%', risk: 'Low', increase: '+2', value: 'Checked In' },
    { id: 2, user: 'John Doe', region: 'Ride: Route B', score: '95%', risk: 'None', increase: '+1', value: 'Completed' },
    { id: 3, user: 'Alex Lee', region: 'Plumbing (A1)', score: '40%', risk: 'High', increase: '0', value: 'Pending' },
    { id: 4, user: 'Sam Rider', region: 'Campus Core', score: '99%', risk: 'Low', increase: '+5', value: 'Active' },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full font-[Inter,sans-serif]">
      {/* Left Column containing title, top wide card, middle row, bottom table */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Your Analytical Board</h1>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-900 transition">
              📅
            </button>
            <div className="bg-white border border-gray-100 rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 shadow-sm cursor-pointer hover:bg-gray-50 transition">
              Select Date <span className="text-gray-400 text-xs">▼</span>
            </div>
          </div>
        </div>

        {/* Top Dark Card (Wide) */}
        <div className="bg-[#101312] rounded-[32px] p-8 relative overflow-hidden shadow-xl">
          <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(186,249,26,0.15),transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between">
            <div>
              <h2 className="text-white text-xl font-medium mb-1 tracking-wide">StayGo Core Metrics</h2>
              <p className="text-gray-400 text-sm mb-6 max-w-sm">
                AI-enhanced operational metrics showing platform usage and active daily requests.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 min-w-[160px] backdrop-blur-md">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-2 uppercase font-semibold tracking-wider">
                  <span className="text-[#BAF91A]">👥</span> Total Users
                </div>
                <div className="text-3xl font-light text-white flex items-end gap-2">
                  {(summary.users || 12846).toLocaleString()} <span className="text-gray-500 text-lg mb-1">↑</span>
                </div>
              </div>

              <div className="bg-[#BAF91A]/10 border border-[#BAF91A]/20 rounded-2xl p-5 min-w-[150px] backdrop-blur-md">
                <div className="flex items-center gap-2 text-[#BAF91A] text-xs mb-2 uppercase font-semibold tracking-wider">
                  <span className="text-white">🚗</span> Active Rides
                </div>
                <div className="text-3xl font-light text-[#BAF91A] flex items-end gap-2">
                  +{summary.activeRiders || 312} <span className="text-[#BAF91A]/60 text-lg mb-1">%</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 min-w-[160px] backdrop-blur-md">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-2 uppercase font-semibold tracking-wider">
                  <span className="text-[#BAF91A]">🎫</span> Open Tickets
                </div>
                <div className="text-3xl font-light text-white">
                  {(summary.bookings || 142).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row (Two Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Room Occupancy (White) */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <span className="text-[#BAF91A]">●</span> Room Occupancy
              </div>
              <span className="text-xs text-gray-400 font-medium">01-07 Jan ▾</span>
            </div>
            <div className="relative flex-1 flex items-center justify-center p-4">
              <div className="w-[180px] h-[180px]">
                <Pie data={roomPieData} options={{ plugins: { legend: { display: false } }, cutout: '70%' }} />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                <span className="text-lg font-bold text-gray-900">{summary.roomsOccupied || 728}</span>
                <span className="text-xs text-gray-500">Occupied</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-xs font-semibold text-gray-500">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#876DFF]"></span> Occupied</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#BAF91A]"></span> Available</div>
            </div>
          </div>

          {/* Card 2: Ticket Analysis (Green) */}
          <div className="bg-[#E2FF99] rounded-[32px] p-6 shadow-sm flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-white/40 to-transparent pointer-events-none" />
             <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <span className="text-gray-900">📊</span> Maintenance Pulse
              </div>
              <span className="text-xs text-gray-500 font-medium bg-white/50 px-2 py-1 rounded-md">01-07 Jan ▾</span>
            </div>
            <div className="flex-1 relative z-10">
               <Bar 
                 data={maintenanceBarData} 
                 options={{ 
                   responsive: true, 
                   maintainAspectRatio: false,
                   plugins: { legend: { display: false } },
                   scales: { x: { display: false }, y: { display: false } }
                 }} 
               />
            </div>
            <div className="flex justify-between items-end mt-4 relative z-10">
              <div className="bg-white/60 px-4 py-2 rounded-xl text-sm font-bold text-gray-800 backdrop-blur-sm shadow-sm">
                Resolved <span className="text-[#876DFF] ml-1">42</span>
              </div>
              <div className="bg-[#101312] px-4 py-2 rounded-xl text-sm font-bold text-white shadow-lg">
                Pending <span className="text-[#BAF91A] ml-1">{summary.pendingRequests || 24}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Table */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 font-semibold text-gray-900">
              <span className="text-[#BAF91A] font-bold text-xl">×</span> Recent Activity
            </div>
            <span className="text-xs text-gray-400 font-medium flex items-center gap-1">Month ▾</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-50">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Location/Module</th>
                  <th className="pb-3 font-semibold">AI Match Score</th>
                  <th className="pb-3 font-semibold">Risk Level</th>
                  <th className="pb-3 font-semibold">Delta</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm border-t border-gray-50">
                {recentActivity.map(item => (
                  <tr key={item.id} className="border-b border-gray-50/50 hover:bg-gray-50/50 transition">
                    <td className="py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                        <img src={`https://i.pravatar.cc/150?u=${item.id}`} alt="User" />
                      </div>
                      <span className="font-semibold text-gray-900">{item.user}</span>
                    </td>
                    <td className="py-4 text-gray-500">{item.region}</td>
                    <td className="py-4 font-semibold text-gray-700">{item.score}</td>
                    <td className="py-4">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`w-1.5 h-3 rounded-full ${i <= (item.risk === 'Low'? 4 : item.risk === 'None'? 5 : 2) ? 'bg-[#BAF91A]' : 'bg-gray-200'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 text-gray-500 font-medium">{item.increase}</td>
                    <td className="py-4 font-semibold text-gray-900 text-right">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [summary, setSummary] = useState({ hostels: 0, rooms: 0, bookings: 0, users: 0, rides: 0, students: 0, roomsOccupied: 0, pendingRequests: 0, activeRiders: 0 });
  const [role, setRole] = useState('admin');

  useEffect(() => {
    async function fetchSummary() {
      try {
        const [hostelsRes, roomsRes, bookingsRes, ridesRes, usersRes, studentsRes, pendingReqRes, ridersRes] = await Promise.all([
          fetch('/api/hostels'),
          fetch('/api/rooms'),
          fetch('/api/bookings'),
          fetch('/api/rides'),
          fetch('/api/users'),
          fetch('/api/students'),
          fetch('/api/requests?status=pending'),
          fetch('/api/riders?active=true'),
        ]);
        const hostels = await hostelsRes.json();
        const rooms = await roomsRes.json();
        const bookings = await bookingsRes.json();
        const rides = await ridesRes.json();
        const users = await usersRes.json();
        const students = await studentsRes.json();
        const pendingRequests = await pendingReqRes.json();
        const activeRiders = await ridersRes.json();
        setSummary({
          hostels: hostels.length,
          rooms: rooms.length,
          bookings: bookings.length,
          users: users.length,
          rides: rides.length,
          students: students.length,
          roomsOccupied: rooms.filter(r => r.occupied).length,
          pendingRequests: pendingRequests.length,
          activeRiders: activeRiders.length,
        });
      } catch (err) {
        // Mock data or silent fail
      }
    }
    fetchSummary();
  }, []);

  return <DashboardHome summary={summary} />;
};

export default AdminDashboard;
