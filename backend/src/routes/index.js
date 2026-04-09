const express = require('express');
const authRoutes = require('./authRoutes');
const mapRoutes = require('./mapRoutes');
const rideRoutes = require('./rideRoutes');
const tripRoutes = require('./tripRoutes');
const incidentRoutes = require('./incidentRoutes');
const adminRoutes = require('./adminRoutes');
const notificationRoutes = require('./notificationRoutes');
const profileRoutes = require('./profileRoutes');

const studentRoutes = require('./studentRoutes');
const roomPreferenceRoutes = require('./roomPreferenceRoutes');
const roomRoutes = require('./roomRoutes');
const matchingRoutes = require('./matchingRoutes');
const roommateNotificationRoutes = require('./roommateNotificationRoutes');
const issueRoutes = require('./issueRoutes');
const roommateAdminRoutes = require('./roommateAdminRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'staygo-backend', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/ride-sharing/maps', mapRoutes);
router.use('/ride-sharing/rides', rideRoutes);
router.use('/ride-sharing/trips', tripRoutes);
router.use('/ride-sharing/incidents', incidentRoutes);
router.use('/ride-sharing/notifications', notificationRoutes);
router.use('/ride-sharing/profile', profileRoutes);
router.use('/admin', adminRoutes);

// Roommate matching module - original local paths (kept to reduce frontend changes)
router.use('/students', studentRoutes);
router.use('/room-preferences', roomPreferenceRoutes);
router.use('/rooms', roomRoutes);
router.use('/matching', matchingRoutes);
router.use('/notifications', roommateNotificationRoutes);
router.use('/issues', issueRoutes);
router.use('/admin', roommateAdminRoutes);

// Roommate matching aliases - namespaced paths for safer long-term separation
router.use('/roommate/students', studentRoutes);
router.use('/roommate/room-preferences', roomPreferenceRoutes);
router.use('/roommate/rooms', roomRoutes);
router.use('/roommate/matching', matchingRoutes);
router.use('/roommate/notifications', roommateNotificationRoutes);
router.use('/roommate/issues', issueRoutes);
router.use('/roommate/admin', roommateAdminRoutes);

module.exports = router;
