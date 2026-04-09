const router = require('express').Router();
const ctrl = require('../controllers/roommateNotificationController');
const { devAuth } = require('../middlewares/devAuth');

router.get('/me', devAuth, ctrl.getMyNotifications);
router.patch('/:id/read', devAuth, ctrl.markAsRead);
router.patch('/read-all', devAuth, ctrl.markAllAsRead);

module.exports = router;
