const { calculateCompatibilityScore } = require('../utils/compatibility');

describe('calculateCompatibilityScore', () => {
  test('returns 100 for identical preferences', () => {
    const prefs = {
      sleepSchedule: 'early_bird',
      noiseLevel: 'quiet',
      cleanliness: 'very_clean',
      smoking: false,
      pets: false,
    };
    expect(calculateCompatibilityScore(prefs, prefs)).toBe(100);
  });

  test('returns 0 for completely different preferences', () => {
    const prefsA = {
      sleepSchedule: 'early_bird',
      noiseLevel: 'quiet',
      cleanliness: 'very_clean',
      smoking: false,
      pets: false,
    };
    const prefsB = {
      sleepSchedule: 'night_owl',
      noiseLevel: 'loud',
      cleanliness: 'relaxed',
      smoking: true,
      pets: true,
    };
    expect(calculateCompatibilityScore(prefsA, prefsB)).toBe(0);
  });

  test('returns 60 for 3 out of 5 matching preferences', () => {
    const prefsA = {
      sleepSchedule: 'early_bird',
      noiseLevel: 'quiet',
      cleanliness: 'very_clean',
      smoking: false,
      pets: false,
    };
    const prefsB = {
      sleepSchedule: 'early_bird',
      noiseLevel: 'quiet',
      cleanliness: 'very_clean',
      smoking: true,
      pets: true,
    };
    expect(calculateCompatibilityScore(prefsA, prefsB)).toBe(60);
  });

  test('returns 0 when preferences are null or undefined', () => {
    expect(calculateCompatibilityScore(null, null)).toBe(0);
    expect(calculateCompatibilityScore(undefined, undefined)).toBe(0);
    expect(calculateCompatibilityScore({}, null)).toBe(0);
  });
});
