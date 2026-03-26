const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { reportIncident, listIncidents, getIncident } = require('../controllers/incidentController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.post('/report', asyncHandler(reportIncident));
router.get('/', asyncHandler(listIncidents));
router.get('/:id', asyncHandler(getIncident));

module.exports = router;
