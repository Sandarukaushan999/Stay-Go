const router = require('express').Router();
const ctrl = require('../controllers/roomPreferenceController');
const { devAuth } = require('../middlewares/devAuth');
const { roomPreferenceRules } = require('../validators/roomValidators');

router.post('/me', devAuth, roomPreferenceRules, ctrl.createOrUpdate);
router.get('/me', devAuth, ctrl.getMyPreference);
router.put('/me', devAuth, roomPreferenceRules, ctrl.updateMyPreference);

module.exports = router;
