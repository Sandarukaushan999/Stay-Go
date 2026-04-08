import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ title, children, className = '', large }) {
  return (
    <motion.div
      className={`bg-gray-900 rounded-xl shadow-xl p-6 text-white ${large ? 'min-h-[340px]' : 'min-h-[160px]'} ${className}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(186,249,26,0.16)' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="font-bold text-lg mb-2 text-lime-400">{title}</div>
      {children || <div className="h-16 flex items-center justify-center text-gray-400">Content</div>}
    </motion.div>
  );
}
