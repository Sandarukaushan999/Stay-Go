const { body } = require('express-validator');
const { AC_TYPE, ROOM_POSITION, AVAILABILITY_STATUS } = require('../constants/enums');

// Student room preference create/update
const roomPreferenceRules = [
    body('block').trim().notEmpty().withMessage('Block is required'),
    body('floor').trim().notEmpty().withMessage('Floor is required'),
    body('acType')
        .isIn(Object.values(AC_TYPE))
        .withMessage(`AC type must be one of: ${Object.values(AC_TYPE).join(', ')}`),
    body('roomPosition')
        .isIn(Object.values(ROOM_POSITION))
        .withMessage(`Room position must be one of: ${Object.values(ROOM_POSITION).join(', ')}`),
    body('capacity')
        .isInt({ min: 1, max: 4 })
        .withMessage('Capacity must be between 1 and 4'),
];

// Admin room create
const roomCreateRules = [
    body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
    body('block').trim().notEmpty().withMessage('Block is required'),
    body('floor').trim().notEmpty().withMessage('Floor is required'),
    body('acType')
        .isIn(Object.values(AC_TYPE))
        .withMessage(`AC type must be one of: ${Object.values(AC_TYPE).join(', ')}`),
    body('roomPosition')
        .isIn(Object.values(ROOM_POSITION))
        .withMessage(`Room position must be one of: ${Object.values(ROOM_POSITION).join(', ')}`),
    body('capacity')
        .isInt({ min: 1 })
        .withMessage('Capacity must be at least 1'),
];

// Admin room update (all optional)
const roomUpdateRules = [
    body('roomNumber').optional().trim().notEmpty(),
    body('block').optional().trim().notEmpty(),
    body('floor').optional().trim().notEmpty(),
    body('acType').optional().isIn(Object.values(AC_TYPE)),
    body('roomPosition').optional().isIn(Object.values(ROOM_POSITION)),
    body('capacity').optional().isInt({ min: 1 }),
];

// Admin room status update
const roomStatusRules = [
    body('availabilityStatus')
        .isIn(Object.values(AVAILABILITY_STATUS))
        .withMessage(
            `Status must be one of: ${Object.values(AVAILABILITY_STATUS).join(', ')}`
        ),
];

module.exports = {
    roomPreferenceRules,
    roomCreateRules,
    roomUpdateRules,
    roomStatusRules,
};
