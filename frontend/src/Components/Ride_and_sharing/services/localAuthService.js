const USERS_KEY = 'staygo_local_users_v1';
const TOKEN_PREFIX = 'staygo-local-token-';

const DEMO_USERS = [
  {
    id: 'local-admin-001',
    role: 'admin',
    name: 'StayGo Admin',
    email: 'admin@gmail.com',
    password: 'admin123',
    contactNumber: '+94-11-555-0100',
    gender: 'other',
    address: 'Colombo, Sri Lanka',
    studentId: 'ADM-0001',
    campusId: 'campus-main',
    isVerified: true,
    isOnline: true,
    isBlocked: false,
    vehicleNumber: '',
    vehicleType: '',
    seatCount: 0,
    availability: 'online',
    hostelLocation: { lat: 6.9143498, lng: 79.972684, addressText: 'Malabe, Sri Lanka' },
    pickupLocation: { lat: 6.9143498, lng: 79.972684, addressText: 'Malabe, Sri Lanka' },
    emergencyContact: { name: 'Campus Control', phone: '+94-11-555-9999' },
    rating: 5,
    complaintCount: 0,
    },
  {
    id: 'local-admin-002',
    role: 'admin',
    name: 'Sandar Admin',
    email: 'sandarukaushan999@gmail.com',
    password: 'Sklm@2001',
    contactNumber: '+94-77-123-4567',
    gender: 'male',
    address: 'Sri Lanka',
    studentId: 'ADM-0002',
    campusId: 'campus-main',
    isVerified: true,
    isOnline: true,
    isBlocked: false,
    vehicleNumber: '',
    vehicleType: '',
    seatCount: 0,
    availability: 'online',
    hostelLocation: { lat: 6.9143498, lng: 79.972684, addressText: 'Malabe, Sri Lanka' },
    pickupLocation: { lat: 6.9143498, lng: 79.972684, addressText: 'Malabe, Sri Lanka' },
    emergencyContact: { name: 'Campus Control', phone: '+94-11-555-9999' },
    rating: 5,
    complaintCount: 0,
  },
  {
    id: 'local-rider-001',
    role: 'rider',
    name: 'Demo Rider',
    email: 'rider@staygo.local',
    password: 'Rider@12345',
    contactNumber: '+94-11-555-0200',
    gender: 'male',
    address: 'Near SLIIT Malabe',
    studentId: 'RID-0001',
    campusId: 'campus-main',
    isVerified: true,
    isOnline: true,
    isBlocked: false,
    vehicleNumber: 'CAR-9812',
    vehicleType: 'Car',
    seatCount: 3,
    availability: 'online',
    hostelLocation: { lat: 6.9162, lng: 79.9741, addressText: 'Near SLIIT Malabe' },
    pickupLocation: { lat: 6.9162, lng: 79.9741, addressText: 'Near SLIIT Malabe' },
    emergencyContact: { name: 'Home', phone: '+94-77-000-0001' },
    rating: 4.7,
    complaintCount: 0,
  },
  {
    id: 'local-passenger-001',
    role: 'passenger',
    name: 'Demo Passenger',
    email: 'passenger@staygo.local',
    password: 'Passenger@12345',
    contactNumber: '+94-11-555-0300',
    gender: 'female',
    address: 'Hostel in Malabe',
    studentId: 'PAS-0001',
    campusId: 'campus-main',
    isVerified: true,
    isOnline: true,
    isBlocked: false,
    vehicleNumber: '',
    vehicleType: '',
    seatCount: 0,
    availability: 'offline',
    hostelLocation: { lat: 6.9181, lng: 79.9698, addressText: 'Hostel in Malabe' },
    pickupLocation: { lat: 6.9181, lng: 79.9698, addressText: 'Hostel in Malabe' },
    emergencyContact: { name: 'Parent Contact', phone: '+94-77-000-0000' },
    rating: 4.8,
    complaintCount: 0,
  },
];

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function generateId(role) {
  return `local-${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createToken(userId) {
  return `${TOKEN_PREFIX}${userId}`;
}

export function isLocalToken(token) {
  return String(token || '').startsWith(TOKEN_PREFIX);
}

function parseTokenUserId(token) {
  if (!isLocalToken(token)) {
    return null;
  }

  return token.slice(TOKEN_PREFIX.length);
}

function toPublicUser(record) {
  return {
    id: record.id,
    role: record.role,
    name: record.name,
    email: record.email,
    contactNumber: record.contactNumber || '',
    gender: record.gender || '',
    address: record.address || '',
    studentId: record.studentId || '',
    campusId: record.campusId || '',
    hostelLocation: record.hostelLocation || { lat: 0, lng: 0, addressText: '' },
    pickupLocation: record.pickupLocation || { lat: 0, lng: 0, addressText: '' },
    vehicleNumber: record.vehicleNumber || '',
    vehicleType: record.vehicleType || '',
    seatCount: Number(record.seatCount || 0),
    availability: record.availability || 'offline',
    emergencyContact: record.emergencyContact || { name: '', phone: '' },
    isVerified: Boolean(record.isVerified),
    isOnline: Boolean(record.isOnline),
    isBlocked: Boolean(record.isBlocked),
    rating: Number(record.rating || 0),
    complaintCount: Number(record.complaintCount || 0),
    createdAt: record.createdAt || new Date().toISOString(),
    updatedAt: record.updatedAt || new Date().toISOString(),
  };
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);

  if (!raw) {
    saveUsers(DEMO_USERS);
    return [...DEMO_USERS];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      saveUsers(DEMO_USERS);
      return [...DEMO_USERS];
    }

    const merged = [...parsed];
    for (const seed of DEMO_USERS) {
      const exists = merged.find((item) => normalizeEmail(item.email) === normalizeEmail(seed.email));
      if (!exists) {
        merged.push(seed);
      }
    }

    saveUsers(merged);
    return merged;
  } catch {
    saveUsers(DEMO_USERS);
    return [...DEMO_USERS];
  }
}

export async function loginLocalUser(payload) {
  const email = normalizeEmail(payload?.email);
  const password = String(payload?.password || '');
  const users = loadUsers();

  const account = users.find((item) => normalizeEmail(item.email) === email);

  if (!account || account.password !== password) {
    throw new Error('Invalid credentials');
  }

  if (account.isBlocked) {
    throw new Error('Your account is blocked by admin');
  }

  return {
    token: createToken(account.id),
    user: toPublicUser(account),
  };
}

export async function registerLocalUser(role, payload) {
  const users = loadUsers();
  const email = normalizeEmail(payload?.email);
  const now = new Date().toISOString();

  if (!email || !payload?.name || !payload?.password) {
    throw new Error('name, email, password are required');
  }

  const existing = users.find((item) => normalizeEmail(item.email) === email);

  if (existing) {
    if (existing.role !== role) {
      throw new Error(`Email already registered as ${existing.role}. Please sign in with that role.`);
    }

    throw new Error('Email already registered');
  }

  const baseUser = {
    id: generateId(role),
    role,
    name: payload.name,
    email,
    password: payload.password,
    contactNumber: payload.contactNumber || '',
    gender: payload.gender || '',
    address: payload.address || '',
    studentId: payload.studentId || '',
    campusId: payload.campusId || '',
    isVerified: role === 'passenger',
    isOnline: false,
    isBlocked: false,
    vehicleNumber: role === 'rider' ? payload.vehicleNumber || '' : '',
    vehicleType: role === 'rider' ? payload.vehicleType || '' : '',
    seatCount: role === 'rider' ? Number(payload.seatCount || 0) : 0,
    availability: role === 'rider' ? 'offline' : 'offline',
    hostelLocation: payload.hostelLocation || { lat: 0, lng: 0, addressText: '' },
    pickupLocation: payload.pickupLocation || payload.hostelLocation || { lat: 0, lng: 0, addressText: '' },
    emergencyContact: payload.emergencyContact || { name: '', phone: '' },
    rating: 5,
    complaintCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const nextUsers = [...users, baseUser];
  saveUsers(nextUsers);

  return {
    token: createToken(baseUser.id),
    user: toPublicUser(baseUser),
  };
}

export function fetchLocalCurrentUser(token) {
  const users = loadUsers();
  const userId = parseTokenUserId(token);

  if (!userId) {
    throw new Error('Session not found');
  }

  const account = users.find((item) => String(item.id) === String(userId));

  if (!account) {
    throw new Error('Session not found');
  }

  if (account.isBlocked) {
    throw new Error('Your account is blocked by admin');
  }

  return toPublicUser(account);
}
