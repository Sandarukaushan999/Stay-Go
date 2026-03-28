import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const menu = [
  { label: 'Dashboard', icon: '🏠', to: '/' },
  { label: 'Students', icon: '🎓', to: '/students' },
  { label: 'Requests', icon: '📥', to: '/requests' },
  { label: 'Technicians', icon: '🛠️', to: '/technicians' },
  { label: 'Riders', icon: '🛵', to: '/riders' },
];

const otherMenu = [
  { label: 'Settings', icon: '⚙️', to: '/settings' },
  { label: 'Info / Help', icon: '❓', to: '/info' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 250 }}
      className="h-full bg-white shadow-xl flex flex-col fixed md:relative z-30 font-[Inter,sans-serif] border-r border-gray-100 rounded-tr-[35px] rounded-br-[35px]"
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
    >
      <div className="flex items-center justify-between px-6 py-8">
        {!collapsed && <span className="text-gray-900 font-bold text-2xl tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-[#101312] rounded-full flex items-center justify-center">
            <span className="text-[#BAF91A] font-extrabold text-sm">S</span>
          </div>
          StayGo
        </span>}
        {collapsed && <div className="w-8 h-8 bg-[#101312] rounded-full flex items-center justify-center mx-auto">
          <span className="text-[#BAF91A] font-extrabold text-sm">S</span>
        </div>}
      </div>
      
      <div className="px-6 pb-2">
        {!collapsed && <p className="text-xs text-gray-400 font-semibold mb-2 ml-2">Main</p>}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 sidebar-scroll">
        <ul className="space-y-1 mb-8">
          {menu.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 select-none cursor-pointer ${
                    isActive 
                      ? 'bg-[#101312] text-white shadow-md transform scale-[1.02]' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`text-xl ${isActive ? 'drop-shadow-[0_0_8px_rgba(186,249,26,0.8)] filter brightness-125 saturate-200' : 'grayscale opacity-60'}`}>
                      {item.icon}
                    </span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="px-2 pb-2">
          {!collapsed && <p className="text-xs text-gray-400 font-semibold mb-2">Other</p>}
        </div>
        <ul className="space-y-1">
          {otherMenu.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 select-none cursor-pointer ${
                    isActive 
                      ? 'bg-[#101312] text-white shadow-md transform scale-[1.02]' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`text-xl ${isActive ? 'drop-shadow-[0_0_8px_rgba(186,249,26,0.8)] filter brightness-125 saturate-200' : 'grayscale opacity-60'}`}>
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

      </nav>

      <div className="p-6 mt-auto">
        <button
          className="flex items-center gap-3 text-gray-500 font-semibold hover:text-gray-900 transition-colors px-2 py-3 w-full"
          onClick={() => {}} // Hook up logout later
        >
          <span className="text-xl">🚪</span>
          {!collapsed && <span>Log out</span>}
        </button>
      </div>

      <div className="absolute right-[-14px] top-1/2 transform -translate-y-1/2">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:text-gray-900 hover:shadow-md transition-all"
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>
    </motion.aside>
  );
}
