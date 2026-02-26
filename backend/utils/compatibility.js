/**
 * Calculate roommate compatibility score (0-100) based on preference overlap.
 * @param {Object} prefsA - Preferences of user A
 * @param {Object} prefsB - Preferences of user B
 * @returns {number} Score between 0 and 100
 */
const calculateCompatibilityScore = (prefsA, prefsB) => {
  if (!prefsA || !prefsB) return 0;

  const fields = ['sleepSchedule', 'noiseLevel', 'cleanliness', 'smoking', 'pets'];
  let matches = 0;

  fields.forEach((field) => {
    if (prefsA[field] !== undefined && prefsB[field] !== undefined) {
      if (prefsA[field] === prefsB[field]) {
        matches += 1;
      }
    }
  });

  return Math.round((matches / fields.length) * 100);
};

module.exports = { calculateCompatibilityScore };
