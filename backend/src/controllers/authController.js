const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { ROLES } = require('../constants/roles');
const { generateAccessToken } = require('../services/tokenService');

function sanitizeUser(user) {
  return user.toPublicJSON ? user.toPublicJSON() : user;
}

async function registerByRole(req, res) {
  const {
    role,
    name,
    email,
    password,
    contactNumber,
    gender,
    address,
    studentId,
    campusId,
    vehicleNumber,
    vehicleType,
    seatCount,
    hostelLocation,
    pickupLocation,
    emergencyContact,
  } = req.body;

  if (!role || !Object.values(ROLES).includes(role) || role === ROLES.ADMIN) {
    return res.status(400).json({ message: 'Invalid role for registration' });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, password are required' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const basePayload = {
    role,
    name,
    email: email.toLowerCase().trim(),
    passwordHash,
    contactNumber: contactNumber || '',
    gender: gender || '',
    address: address || '',
    studentId: studentId || '',
    campusId: campusId || '',
    isVerified: role === ROLES.PASSENGER,
    isOnline: false,
  };

  if (role === ROLES.RIDER) {
    basePayload.vehicleNumber = vehicleNumber || '';
    basePayload.vehicleType = vehicleType || '';
    basePayload.seatCount = Number(seatCount || 0);
    basePayload.hostelLocation = hostelLocation || { lat: 0, lng: 0, addressText: '' };
  }

  if (role === ROLES.PASSENGER) {
    basePayload.pickupLocation = pickupLocation || { lat: 0, lng: 0, addressText: '' };
    basePayload.emergencyContact = emergencyContact || { name: '', phone: '' };
  }

  const user = await User.create(basePayload);
  const token = generateAccessToken(user);

  return res.status(201).json({
    token,
    user: sanitizeUser(user),
  });
}

async function registerRider(req, res) {
  req.body.role = ROLES.RIDER;
  return registerByRole(req, res);
}

async function registerPassenger(req, res) {
  req.body.role = ROLES.PASSENGER;
  return registerByRole(req, res);
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (user.isBlocked) {
    return res.status(403).json({ message: 'Your account is blocked by admin' });
  }

  const token = generateAccessToken(user);

  return res.json({
    token,
    user: sanitizeUser(user),
  });
}

async function me(req, res) {
  return res.json({ user: sanitizeUser(req.user) });
}

module.exports = {
  registerRider,
  registerPassenger,
  login,
  me,
};
