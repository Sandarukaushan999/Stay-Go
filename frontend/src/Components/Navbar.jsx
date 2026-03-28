import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <motion.header
      className="sticky top-0 z-20 bg-transparent flex items-center justify-between px-8 py-5"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          className="font-bold text-xl text-gray-900 hover:text-[#BAF91A] transition focus:outline-none"
          onClick={() => navigate("/admin")}
          type="button"
        >
          Dashboard
        </button>
      </div>

      <div className="flex items-center gap-5">
        {/* Notification Button */}
        <button className="relative bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-2.5 rounded-full hover:bg-gray-50 transition">
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#BAF91A] rounded-full animate-pulse border-2 border-white" />
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-600">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </button>

        {/* Profile Card (CLICKABLE) */}
        <motion.button
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-full p-1 pr-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-md transition text-left"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/admin/profile")}
        >
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Admin User"
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
          />
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-bold text-gray-900 leading-tight">Admin User</span>
            <span className="text-[10px] text-gray-400 font-medium tracking-wide text-left">StayGo Admin</span>
          </div>
        </motion.button>

        {/* Mobile Menu */}
        <button className="md:hidden p-2 rounded-full hover:bg-white border border-transparent hover:border-gray-200 transition text-gray-700">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </motion.header>
  );
}

export default Navbar;