import React from 'react';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';

const Layout = ({ sidebarItems, children, profile }) => (
  <div className="flex h-screen bg-gray-100">
    <Sidebar items={sidebarItems} />
    <div className="flex-1 flex flex-col">
      <Navbar profile={profile} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  </div>
);

export default Layout;
