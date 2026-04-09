const router = require('express').Router();
const ctrl = require('../controllers/matchingController');
const { devAuth } = require('../middlewares/devAuth');
const { matchRequestParamRules, requestIdParamRules } = require('../validators/matchValidators');

router.get('/suggestions', devAuth, ctrl.getSuggestions);
router.post('/requests/:receiverStudentId', devAuth, matchRequestParamRules, ctrl.sendRequest);
router.get('/requests/sent', devAuth, ctrl.getSentRequests);
router.get('/requests/received', devAuth, ctrl.getReceivedRequests);
router.patch('/requests/:requestId/accept', devAuth, requestIdParamRules, ctrl.acceptRequest);
router.patch('/requests/:requestId/reject', devAuth, requestIdParamRules, ctrl.rejectRequest);
router.patch('/requests/:requestId/cancel', devAuth, requestIdParamRules, ctrl.cancelRequest);
router.get('/pair/me', devAuth, ctrl.getMyPair);

module.exports = router;
