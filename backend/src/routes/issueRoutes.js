const router = require('express').Router();
const ctrl = require('../controllers/issueController');
const { devAuth, adminOnly } = require('../middlewares/devAuth');
const upload = require('../middlewares/upload');
const {
    issueCreateRules,
    issueUpdateRules,
    issueStatusRules,
    issueCommentRules,
} = require('../validators/issueValidators');

// Student routes
router.post('/', devAuth, upload.single('attachmentImage'), issueCreateRules, ctrl.createIssue);
router.get('/me', devAuth, ctrl.getMyIssues);
router.get('/:id', devAuth, ctrl.getIssueById);
router.patch('/:id', devAuth, upload.single('attachmentImage'), issueUpdateRules, ctrl.updateIssue);

// Admin routes
router.patch('/:id/status', devAuth, adminOnly, issueStatusRules, ctrl.updateIssueStatus);
router.patch('/:id/comment', devAuth, adminOnly, issueCommentRules, ctrl.addAdminComment);

module.exports = router;
