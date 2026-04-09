const { SLEEP_SCHEDULE, SOCIAL_HABITS, STUDY_HABITS } = require('../constants/enums');

// ── Weight configuration ──
const WEIGHTS = {
    sleepSchedule: 0.3,
    cleanliness: 0.3,
    socialHabits: 0.2,
    studyHabits: 0.2,
};

/**
 * Sleep schedule comparison — exact match = 1, mismatch = 0
 */
function sleepScore(a, b) {
    return a === b ? 1 : 0;
}

/**
 * Cleanliness comparison on 1–5 scale.
 * diff 0 → 1.0, diff 1 → 0.75, diff 2 → 0.5, diff 3+ → 0.25
 */
function cleanlinessScore(a, b) {
    const diff = Math.abs(a - b);
    if (diff === 0) return 1;
    if (diff === 1) return 0.75;
    if (diff === 2) return 0.5;
    return 0.25;
}

/**
 * Social habits — exact match = 1, one step apart = 0.5, two steps = 0
 */
function socialScore(a, b) {
    const order = [SOCIAL_HABITS.QUIET, SOCIAL_HABITS.MODERATE, SOCIAL_HABITS.SOCIAL];
    const diff = Math.abs(order.indexOf(a) - order.indexOf(b));
    if (diff === 0) return 1;
    if (diff === 1) return 0.5;
    return 0;
}

/**
 * Study habits — exact match = 1, one step apart = 0.5, two steps = 0
 */
function studyScore(a, b) {
    const order = [STUDY_HABITS.SILENT, STUDY_HABITS.SOME_NOISE, STUDY_HABITS.ANY];
    const diff = Math.abs(order.indexOf(a) - order.indexOf(b));
    if (diff === 0) return 1;
    if (diff === 1) return 0.5;
    return 0;
}

/**
 * Calculate raw compatibility score between two student profiles (0.0 – 1.0).
 */
function calculateRawScore(profileA, profileB) {
    const raw =
        WEIGHTS.sleepSchedule * sleepScore(profileA.sleepSchedule, profileB.sleepSchedule) +
        WEIGHTS.cleanliness * cleanlinessScore(profileA.cleanliness, profileB.cleanliness) +
        WEIGHTS.socialHabits * socialScore(profileA.socialHabits, profileB.socialHabits) +
        WEIGHTS.studyHabits * studyScore(profileA.studyHabits, profileB.studyHabits);

    return raw;
}

/**
 * Convert raw score (0–1) to visible 50–100 range.
 */
function toVisibleScore(raw) {
    return Math.round(50 + raw * 50);
}

module.exports = { calculateRawScore, toVisibleScore };
