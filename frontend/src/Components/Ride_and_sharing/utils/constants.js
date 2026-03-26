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
  center: [7.2906, 80.6337],
  zoom: 13,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; OpenStreetMap contributors',
};

export const CAMPUSES = [
  {
    id: 'campus-main',
    name: 'Main Campus',
    location: { lat: 7.2906, lng: 80.6337, addressText: 'Main Campus' },
  },
  {
    id: 'campus-tech',
    name: 'Tech Campus',
    location: { lat: 7.2753, lng: 80.6211, addressText: 'Tech Campus' },
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
