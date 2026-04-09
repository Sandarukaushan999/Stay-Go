import { isTripOverdue } from './tripCalculations';

export function evaluateSafetyRules({ trip, complaintCount = 0, staleMinutes = 10 }) {
  const triggered = [];

  if (isTripOverdue({ trip })) {
    triggered.push('RULE_1_OVERDUE');
  }

  if (trip?.currentLocation?.updatedAt) {
    const staleMs = Date.now() - new Date(trip.currentLocation.updatedAt).getTime();
    if (staleMs > staleMinutes * 60 * 1000) {
      triggered.push('RULE_4_SUSPICIOUS_STOP');
    }
  }

  if (complaintCount >= 3) {
    triggered.push('RULE_5_RIDER_REVIEW');
  }

  return triggered;
}

export const overdueSafetyMessage =
  'Dear Sir, Are You Okey? If anything happened please contact us.';
