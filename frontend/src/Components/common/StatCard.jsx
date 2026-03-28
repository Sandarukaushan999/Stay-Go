import React from 'react';

const StatCard = ({ label, value, change, changeColor = 'text-lime-400', icon, dark = true }) => (
  <div className={`${dark ? 'bg-gray-900' : 'bg-white'} rounded-xl p-6 text-center shadow flex flex-col items-center`}>
    {icon && <div className="mb-2 text-2xl">{icon}</div>}
    <div className={`${dark ? 'text-gray-300' : 'text-gray-500'} text-lg mb-2`}>{label}</div>
    <div className={`${dark ? 'text-white' : 'text-gray-900'} text-4xl font-bold`}>{value}</div>
    {change && <div className={`${changeColor} mt-2 text-sm`}>{change}</div>}
  </div>
);

export default StatCard;
