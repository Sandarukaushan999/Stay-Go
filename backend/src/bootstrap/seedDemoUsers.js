const bcrypt = require('bcryptjs');
const env = require('../config/env');
const User = require('../models/User');
const { ROLES } = require('../constants/roles');

async function upsertUser({ email, password, role, name, patch = {} }) {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  const passwordHash = await bcrypt.hash(password, 10);

  if (existing) {
    existing.name = name;
    existing.passwordHash = passwordHash;
    existing.role = role;
    Object.assign(existing, patch);
    await existing.save();
    return existing;
  }

  const user = await User.create({
    role,
    name,
    email: normalizedEmail,
    passwordHash,
    ...patch,
  });

  return user;
}

async function seedDemoUsers() {
  const admin = await upsertUser({
    email: env.adminSeed.email,
    password: env.adminSeed.password,
    role: ROLES.ADMIN,
    name: env.adminSeed.name,
    patch: {
      isVerified: true,
      isOnline: true,
      campusId: 'campus-main',
      contactNumber: '+94-11-555-0100',
    },
  });

  const rider = await upsertUser({
    email: env.riderSeed.email,
    password: env.riderSeed.password,
    role: ROLES.RIDER,
    name: env.riderSeed.name,
    patch: {
      contactNumber: '+94-11-555-0200',
      gender: 'male',
      address: 'Hostel A, Kandy',
      studentId: 'RID-0001',
      campusId: 'campus-main',
      vehicleNumber: 'CAR-9812',
      vehicleType: 'car',
      seatCount: 3,
      availability: 'online',
      hostelLocation: { lat: 7.2906, lng: 80.6337, addressText: 'Hostel A, Kandy' },
      isVerified: true,
      isOnline: true,
      rating: 4.7,
    },
  });

  const passenger = await upsertUser({
    email: env.passengerSeed.email,
    password: env.passengerSeed.password,
    role: ROLES.PASSENGER,
    name: env.passengerSeed.name,
    patch: {
      contactNumber: '+94-11-555-0300',
      gender: 'female',
      address: 'Hostel C, Kandy',
      studentId: 'PAS-0001',
      campusId: 'campus-main',
      pickupLocation: { lat: 7.292, lng: 80.635, addressText: 'Hostel C, Kandy' },
      emergencyContact: { name: 'Parent Contact', phone: '+94-77-000-0000' },
      isVerified: true,
      isOnline: true,
      rating: 4.8,
    },
  });

  return { admin, rider, passenger };
}

module.exports = {
  seedDemoUsers,
};
