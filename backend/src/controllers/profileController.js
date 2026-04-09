const { ROLES } = require('../constants/roles');

async function getMyProfile(req, res) {
  return res.json({ user: req.user.toPublicJSON() });
}

async function updateMyProfile(req, res) {
  const allowedFields = [
    'name',
    'contactNumber',
    'gender',
    'address',
    'studentId',
    'campusId',
    'hostelLocation',
    'pickupLocation',
    'vehicleNumber',
    'vehicleType',
    'seatCount',
    'availability',
    'emergencyContact',
  ];

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      req.user[field] = req.body[field];
    }
  }

  if (req.user.role !== ROLES.RIDER) {
    req.user.vehicleNumber = '';
    req.user.vehicleType = '';
    req.user.seatCount = 0;
  }

  await req.user.save();

  return res.json({ user: req.user.toPublicJSON() });
}

async function updateRiderAvailability(req, res) {
  if (req.user.role !== ROLES.RIDER) {
    return res.status(403).json({ message: 'Only riders can change availability' });
  }

  const { isOnline = false, availability = 'offline' } = req.body;
  req.user.isOnline = Boolean(isOnline);
  req.user.availability = availability;
  await req.user.save();

  return res.json({ user: req.user.toPublicJSON() });
}

module.exports = {
  getMyProfile,
  updateMyProfile,
  updateRiderAvailability,
};
