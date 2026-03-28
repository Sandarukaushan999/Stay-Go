import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => (
  <div className="flex h-screen bg-[#F0F2F6] font-[Inter,sans-serif]">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0 bg-[#F5F6FA]">
      <Navbar />
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <Outlet />
      </main>
    </div>
  </div>
);

export default MainLayout;
