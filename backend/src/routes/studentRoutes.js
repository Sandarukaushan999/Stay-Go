const router = require('express').Router();
const ctrl = require('../controllers/studentController');
const { devAuth } = require('../middlewares/devAuth');
const { profileCreateRules, profileUpdateRules } = require('../validators/studentValidators');

router.post('/profile', devAuth, profileCreateRules, ctrl.createProfile);
router.get('/profile/me', devAuth, ctrl.getMyProfile);
router.put('/profile/me', devAuth, profileUpdateRules, ctrl.updateMyProfile);
router.get('/:id', devAuth, ctrl.getStudentById);

module.exports = router;
