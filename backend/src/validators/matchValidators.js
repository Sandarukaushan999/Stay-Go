const { param } = require('express-validator');

const matchRequestParamRules = [
    param('receiverStudentId').isMongoId().withMessage('Invalid receiver student ID'),
];

const requestIdParamRules = [
    param('requestId').isMongoId().withMessage('Invalid request ID'),
];

module.exports = { matchRequestParamRules, requestIdParamRules };
