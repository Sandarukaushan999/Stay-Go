const router = require('express').Router();
const issueController = require('../controllers/issueController');
const { devAuth, adminOnly } = require('../middlewares/devAuth');

router.get('/issues', devAuth, adminOnly, issueController.listAllIssues);

module.exports = router;
