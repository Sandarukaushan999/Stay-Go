const { body } = require('express-validator');
const { SLEEP_SCHEDULE, SOCIAL_HABITS, STUDY_HABITS } = require('../constants/enums');

const profileCreateRules = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('whatsApp').trim().notEmpty().withMessage('WhatsApp number is required'),
    body('gender').trim().notEmpty().withMessage('Gender is required'),
    body('age').isInt({ min: 1 }).withMessage('Age must be a positive integer'),
    body('sleepSchedule')
        .isIn(Object.values(SLEEP_SCHEDULE))
        .withMessage(`Sleep schedule must be one of: ${Object.values(SLEEP_SCHEDULE).join(', ')}`),
    body('cleanliness')
        .isInt({ min: 1, max: 5 })
        .withMessage('Cleanliness must be between 1 and 5'),
    body('socialHabits')
        .isIn(Object.values(SOCIAL_HABITS))
        .withMessage(`Social habits must be one of: ${Object.values(SOCIAL_HABITS).join(', ')}`),
    body('studyHabits')
        .isIn(Object.values(STUDY_HABITS))
        .withMessage(`Study habits must be one of: ${Object.values(STUDY_HABITS).join(', ')}`),
];

// Update allows partial body — use optional() for each field
const profileUpdateRules = [
    body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
    body('address').optional().trim().notEmpty().withMessage('Address cannot be empty'),
    body('email').optional().trim().isEmail().withMessage('Valid email is required'),
    body('whatsApp').optional().trim().notEmpty().withMessage('WhatsApp number cannot be empty'),
    body('gender').optional().trim().notEmpty().withMessage('Gender cannot be empty'),
    body('age').optional().isInt({ min: 1 }).withMessage('Age must be a positive integer'),
    body('sleepSchedule')
        .optional()
        .isIn(Object.values(SLEEP_SCHEDULE))
        .withMessage(`Sleep schedule must be one of: ${Object.values(SLEEP_SCHEDULE).join(', ')}`),
    body('cleanliness')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Cleanliness must be between 1 and 5'),
    body('socialHabits')
        .optional()
        .isIn(Object.values(SOCIAL_HABITS))
        .withMessage(`Social habits must be one of: ${Object.values(SOCIAL_HABITS).join(', ')}`),
    body('studyHabits')
        .optional()
        .isIn(Object.values(STUDY_HABITS))
        .withMessage(`Study habits must be one of: ${Object.values(STUDY_HABITS).join(', ')}`),
];

module.exports = { profileCreateRules, profileUpdateRules };
