// Sample data for dashboards
export const adminStats = [
  { label: 'Verified Users', value: 9812, change: '+8.4% vs last period', changeColor: 'text-lime-400', icon: '✅' },
  { label: 'Open Tickets', value: 148, change: '-12.1% vs last period', changeColor: 'text-red-400', icon: '🎫' },
  { label: 'Active Rides Now', value: 64, change: '+5.8% vs last period', changeColor: 'text-lime-400', icon: '🚗' },
  { label: 'Total Students', value: 1200, icon: '🎓' },
  { label: 'Rooms Occupied', value: 350, icon: '🛏️' },
  { label: 'Pending Requests', value: 23, icon: '⏳' },
  { label: 'Active Riders', value: 12, icon: '🛵' },
];

export const studentStats = [
  { label: 'Room Number', value: 'B-204', icon: '🛏️', dark: false },
  { label: 'Fee Status', value: 'Paid', icon: '💳', dark: false },
  { label: 'Active Requests', value: 2, icon: '🛠️', dark: false },
  { label: 'Notifications', value: 3, icon: '🔔', dark: false },
];

export const technicianStats = [
  { label: 'Assigned Tasks', value: 8, icon: '📝' },
  { label: 'Completed Tasks', value: 20, icon: '✅' },
  { label: 'Pending Tasks', value: 3, icon: '⏳' },
];

export const riderStats = [
  { label: 'Active Deliveries', value: 4, icon: '🚚' },
  { label: 'Completed Deliveries', value: 30, icon: '✅' },
  { label: 'Earnings', value: '$120', icon: '💰' },
];
