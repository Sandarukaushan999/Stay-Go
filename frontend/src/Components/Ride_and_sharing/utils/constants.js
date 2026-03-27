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


export const LIVE_MAP_UNIVERSITIES = [
  {
    id: 'uoc',
    name: 'University of Colombo',
    category: 'State University',
    location: { lat: 6.9003, lng: 79.8588, addressText: 'Colombo 03, Sri Lanka' },
  },
  {
    id: 'uop',
    name: 'University of Peradeniya',
    category: 'State University',
    location: { lat: 7.2568, lng: 80.5975, addressText: 'Peradeniya, Sri Lanka' },
  },
  {
    id: 'usjp',
    name: 'University of Sri Jayewardenepura',
    category: 'State University',
    location: { lat: 6.8528, lng: 79.9036, addressText: 'Nugegoda, Sri Lanka' },
  },
  {
    id: 'uok',
    name: 'University of Kelaniya',
    category: 'State University',
    location: { lat: 6.9745, lng: 79.9156, addressText: 'Kelaniya, Sri Lanka' },
  },
  {
    id: 'uom',
    name: 'University of Moratuwa',
    category: 'State University',
    location: { lat: 6.7963, lng: 79.9016, addressText: 'Katubedda, Moratuwa, Sri Lanka' },
  },
  {
    id: 'uor',
    name: 'University of Ruhuna',
    category: 'State University',
    location: { lat: 5.9396, lng: 80.5768, addressText: 'Matara, Sri Lanka' },
  },
  {
    id: 'uoj',
    name: 'University of Jaffna',
    category: 'State University',
    location: { lat: 9.6848, lng: 80.0219, addressText: 'Jaffna, Sri Lanka' },
  },
  {
    id: 'ou-sl',
    name: 'The Open University of Sri Lanka',
    category: 'State University',
    location: { lat: 6.8853, lng: 79.8866, addressText: 'Nawala, Sri Lanka' },
  },
  {
    id: 'eastern-university',
    name: 'Eastern University, Sri Lanka',
    category: 'State University',
    location: { lat: 7.7945, lng: 81.579, addressText: 'Vantharumoolai, Batticaloa, Sri Lanka' },
  },
  {
    id: 'south-eastern-university',
    name: 'South Eastern University of Sri Lanka',
    category: 'State University',
    location: { lat: 7.2982, lng: 81.8514, addressText: 'Oluvil, Sri Lanka' },
  },
  {
    id: 'rajarata-university',
    name: 'Rajarata University of Sri Lanka',
    category: 'State University',
    location: { lat: 8.3608, lng: 80.5045, addressText: 'Mihintale, Sri Lanka' },
  },
  {
    id: 'sabaragamuwa-university',
    name: 'Sabaragamuwa University of Sri Lanka',
    category: 'State University',
    location: { lat: 6.7146, lng: 80.7872, addressText: 'Belihuloya, Sri Lanka' },
  },
  {
    id: 'wayamba-university',
    name: 'Wayamba University of Sri Lanka',
    category: 'State University',
    location: { lat: 7.3227, lng: 80.0401, addressText: 'Kuliyapitiya, Sri Lanka' },
  },
  {
    id: 'uva-wellassa-university',
    name: 'Uva Wellassa University',
    category: 'State University',
    location: { lat: 6.982, lng: 81.0765, addressText: 'Badulla, Sri Lanka' },
  },
  {
    id: 'uvpa',
    name: 'University of the Visual and Performing Arts',
    category: 'State University',
    location: { lat: 6.9102, lng: 79.8637, addressText: 'Colombo, Sri Lanka' },
  },
  {
    id: 'uov',
    name: 'University of Vavuniya',
    category: 'State University',
    location: { lat: 8.7594, lng: 80.4982, addressText: 'Vavuniya, Sri Lanka' },
  },
  {
    id: 'uvosl',
    name: 'University of Vocational Technology',
    category: 'State University',
    location: { lat: 6.8212, lng: 79.8865, addressText: 'Ratmalana, Sri Lanka' },
  },
  {
    id: 'gwuim',
    name: 'Gampaha Wickramarachchi University of Indigenous Medicine',
    category: 'State University',
    location: { lat: 7.0927, lng: 80.0165, addressText: 'Yakkala, Sri Lanka' },
  },
  {
    id: 'ocean-university',
    name: 'Ocean University of Sri Lanka',
    category: 'State University',
    location: { lat: 6.9941, lng: 79.8758, addressText: 'Crow Island, Colombo, Sri Lanka' },
  },
  {
    id: 'kdu',
    name: 'General Sir John Kotelawala Defence University',
    category: 'State University',
    location: { lat: 6.819, lng: 79.8855, addressText: 'Ratmalana, Sri Lanka' },
  },
  {
    id: 'sliit-main',
    name: 'SLIIT Malabe',
    category: 'Private / Non-State',
    location: { lat: 6.9143, lng: 79.9727, addressText: 'Malabe, Sri Lanka' },
  },
  {
    id: 'sliit-metro',
    name: 'SLIIT Metropolitan Campus',
    category: 'Private / Non-State',
    location: { lat: 6.9127, lng: 79.8507, addressText: 'Colombo 03, Sri Lanka' },
  },
  {
    id: 'nsbm',
    name: 'NSBM Green University',
    category: 'Private / Non-State',
    location: { lat: 6.8217, lng: 80.0417, addressText: 'Homagama, Sri Lanka' },
  },
  {
    id: 'cinec',
    name: 'CINEC Campus',
    category: 'Private / Non-State',
    location: { lat: 6.905, lng: 79.958, addressText: 'Malabe, Sri Lanka' },
  },
  {
    id: 'horizon',
    name: 'Horizon Campus',
    category: 'Private / Non-State',
    location: { lat: 6.9105, lng: 79.9738, addressText: 'Malabe, Sri Lanka' },
  },
  {
    id: 'kiu',
    name: 'KIU (KIU Campus)',
    category: 'Private / Non-State',
    location: { lat: 6.9064, lng: 79.9415, addressText: 'Koswatta, Sri Lanka' },
  },
  {
    id: 'sltc',
    name: 'SLTC Research University',
    category: 'Private / Non-State',
    location: { lat: 6.8444, lng: 80.0624, addressText: 'Padukka, Sri Lanka' },
  },
  {
    id: 'iit',
    name: 'Informatics Institute of Technology (IIT)',
    category: 'Private / Non-State',
    location: { lat: 6.8938, lng: 79.8541, addressText: 'Colombo, Sri Lanka' },
  },
  {
    id: 'apiit',
    name: 'APIIT Sri Lanka',
    category: 'Private / Non-State',
    location: { lat: 6.9112, lng: 79.8612, addressText: 'Colombo, Sri Lanka' },
  },
  {
    id: 'icbt',
    name: 'ICBT Campus',
    category: 'Private / Non-State',
    location: { lat: 6.9048, lng: 79.8683, addressText: 'Colombo, Sri Lanka' },
  },
  {
    id: 'esoft',
    name: 'ESOFT Metro Campus',
    category: 'Private / Non-State',
    location: { lat: 6.9147, lng: 79.8544, addressText: 'Colombo, Sri Lanka' },
  },
  {
    id: 'nibm',
    name: 'NIBM Colombo',
    category: 'Private / Non-State',
    location: { lat: 6.9095, lng: 79.8746, addressText: 'Colombo, Sri Lanka' },
  },
  {
    id: 'saegis',
    name: 'Saegis Campus',
    category: 'Private / Non-State',
    location: { lat: 6.8769, lng: 79.8888, addressText: 'Nugegoda, Sri Lanka' },
  },
  {
    id: 'nchs',
    name: 'NCHS (Nawaloka College of Higher Studies)',
    category: 'Private / Non-State',
    location: { lat: 6.9036, lng: 79.8548, addressText: 'Colombo, Sri Lanka' },
  },
  {
    id: 'anc',
    name: 'ANC Education',
    category: 'Private / Non-State',
    location: { lat: 6.9098, lng: 79.8654, addressText: 'Colombo, Sri Lanka' },
  },
  {
    id: 'bms',
    name: 'BMS (Business Management School)',
    category: 'Private / Non-State',
    location: { lat: 6.8904, lng: 79.8684, addressText: 'Colombo, Sri Lanka' },
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

