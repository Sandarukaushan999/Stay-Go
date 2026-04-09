const { body } = require('express-validator');
const { ISSUE_CATEGORY, ISSUE_PRIORITY, ISSUE_STATUS } = require('../constants/enums');

const issueCreateRules = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category')
        .isIn(Object.values(ISSUE_CATEGORY))
        .withMessage(`Category must be one of: ${Object.values(ISSUE_CATEGORY).join(', ')}`),
    body('priority')
        .isIn(Object.values(ISSUE_PRIORITY))
        .withMessage(`Priority must be one of: ${Object.values(ISSUE_PRIORITY).join(', ')}`),
    body('additionalNotes').optional().trim(),
    body('roomNumber').optional().trim(),
];

const issueUpdateRules = [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('category').optional().isIn(Object.values(ISSUE_CATEGORY)),
    body('priority').optional().isIn(Object.values(ISSUE_PRIORITY)),
    body('additionalNotes').optional().trim(),
];

const issueStatusRules = [
    body('status')
        .isIn(Object.values(ISSUE_STATUS))
        .withMessage(`Status must be one of: ${Object.values(ISSUE_STATUS).join(', ')}`),
];

const issueCommentRules = [
    body('adminComment').trim().notEmpty().withMessage('Admin comment is required'),
];

module.exports = {
    issueCreateRules,
    issueUpdateRules,
    issueStatusRules,
    issueCommentRules,
};
