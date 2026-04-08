import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';

const menu = [
  { label: 'Dashboard', icon: '🏠', to: '/' },
  { label: 'Students', icon: '🎓', to: '/students' },
  { label: 'Requests', icon: '📥', to: '/requests' },
  { label: 'Technicians', icon: '🛠️', to: '/technicians' },
  { label: 'Riders', icon: '🛵', to: '/riders' },
];

const otherMenu = [
  { label: 'Settings', icon: '⚙️', to: '/admin/settings' },
  { label: 'Info / Help', icon: '❓', to: '/info' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/admin");
  const navigate = useNavigate();

  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'admin') setDashboardPath("/admin");
        else if (parsed.role === 'student') setDashboardPath("/student");
        else if (parsed.role === 'rider') setDashboardPath("/rider");
        else if (parsed.role === 'technician' || parsed.role === 'technitian') setDashboardPath("/technitian");
        else setDashboardPath("/");
      }
    } catch (e) {}
  }, []);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const executeLogout = () => {
    setShowLogoutConfirm(false);
    setShowToast(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }, 1500);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
    navigate(dashboardPath);
  };
  return (
    <>
      {/* Logout Success Toast (styled to match "Saved successfully") */}
      {showToast && (
        <motion.div
          className="fixed top-20 right-8 bg-[#BAF91A] text-[#101312] px-6 py-3 rounded-2xl font-bold shadow-lg z-[9999] flex items-center gap-2 pointer-events-none"
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <span>✓</span> Successfully logged out!
        </motion.div>
      )}

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex flex-col gap-6 bg-white px-8 py-8 rounded-[32px] shadow-2xl border border-gray-100 max-w-sm w-full mx-4"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mb-2">
                🚪
              </div>
              <h3 className="text-xl font-bold text-gray-900">Are you sure?</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to log out? You will need to log back in to access your dashboard.
              </p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <button 
                onClick={cancelLogout} 
                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-xl transition"
              >
                No
              </button>
              <button 
                onClick={executeLogout} 
                className="flex-1 bg-[#101312] hover:bg-black text-[#BAF91A] font-bold py-3 rounded-xl transition shadow-lg"
              >
                Yes, Log out
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
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
                to={item.label === 'Dashboard' ? dashboardPath : item.to}
                end={item.label === 'Dashboard'}
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
                    {!collapsed && <span className={`truncate ${isActive ? "text-white" : ""}`}>{item.label}</span>}
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
                    {!collapsed && <span className={isActive ? "text-white" : ""}>{item.label}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

      </nav>

      <div className="p-6 mt-auto">
        <button
          className="flex items-center gap-3 text-gray-500 font-semibold hover:text-red-500 transition-colors px-2 py-3 w-full"
          onClick={handleLogoutClick}
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
    </>
  );
}
