const express = require('express');
const authRoutes = require('./authRoutes');
const mapRoutes = require('./mapRoutes');
const rideRoutes = require('./rideRoutes');
const tripRoutes = require('./tripRoutes');
const incidentRoutes = require('./incidentRoutes');
const adminRoutes = require('./adminRoutes');
const notificationRoutes = require('./notificationRoutes');
const profileRoutes = require('./profileRoutes');

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

module.exports = router;
