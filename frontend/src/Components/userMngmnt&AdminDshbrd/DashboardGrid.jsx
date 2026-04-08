import React from 'react';
import Card from './Card';
import { motion } from 'framer-motion';

export default function DashboardGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
    >
      <Card className="lg:row-span-2" title="Overview" large />
      <div className="flex flex-col gap-6">
        <Card title="Quick Stats" />
        <Card title="Recent Activity" />
      </div>
    </motion.div>
  );
}
