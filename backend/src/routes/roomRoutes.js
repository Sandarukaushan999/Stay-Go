const router = require('express').Router();
const ctrl = require('../controllers/roomController');
const { devAuth, adminOnly } = require('../middlewares/devAuth');
const {
    roomCreateRules,
    roomUpdateRules,
    roomStatusRules,
} = require('../validators/roomValidators');

// Public / student-accessible
router.get('/', devAuth, ctrl.listRooms);
router.get('/available', devAuth, ctrl.listAvailableRooms);

// Admin-only
router.post('/', devAuth, adminOnly, roomCreateRules, ctrl.createRoom);
router.put('/:id', devAuth, adminOnly, roomUpdateRules, ctrl.updateRoom);
router.patch('/:id/status', devAuth, adminOnly, roomStatusRules, ctrl.updateRoomStatus);
router.post('/:id/assign-student/:studentId', devAuth, adminOnly, ctrl.assignStudent);

module.exports = router;
