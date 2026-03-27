export const USER_ROLES = {
  ADMIN: 'admin',
  RIDER: 'rider',
  PASSENGER: 'passenger',
};

export const RIDE_STATUS = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  STARTED: 'started',
  OVERDUE: 'overdue',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
};

export const TRIP_STATUS = {
  STARTED: 'started',
  OVERDUE: 'overdue',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const MAP_DEFAULTS = {
  center: [6.9143498, 79.972684],
  zoom: 14,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; OpenStreetMap contributors',
};

export const CAMPUSES = [
  {
    id: 'campus-main',
    name: 'SLIIT Malabe (Main Campus)',
    location: {
      lat: 6.9143498,
      lng: 79.972684,
      addressText: 'SLIIT, New Kandy Road, Malabe, Sri Lanka',
    },
  },
  {
    id: 'campus-metro',
    name: 'SLIIT Metropolitan Campus',
    location: {
      lat: 6.9126638,
      lng: 79.8506854,
      addressText: "Merchant Tower, St Michael's Road, Colombo 03, Sri Lanka",
    },
  },
];

export const ROUTE_PATHS = {
  home: '/',
  login: '/login',
  riderRegister: '/rider/register',
  passengerRegister: '/passenger/register',
  riderDashboard: '/rider/dashboard',
  passengerDashboard: '/passenger/dashboard',
  activeTrip: '/trip/active/:tripId',
  tripHistory: '/trip/history',
  adminDashboard: '/admin/dashboard',
  adminUsers: '/admin/users',
  adminTrips: '/admin/trips',
  adminIncidents: '/admin/incidents',
};
