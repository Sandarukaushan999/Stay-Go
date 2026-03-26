const env = require('../config/env');
const Trip = require('../models/Trip');
const RideRequest = require('../models/RideRequest');
const { TRIP_STATUS } = require('../constants/status');
const { createNotification, notifyAdmins } = require('./notificationService');

async function processOverdueAndStops() {
  const now = new Date();
  const activeTrips = await Trip.find({
    status: { $in: [TRIP_STATUS.STARTED, TRIP_STATUS.OVERDUE] },
    completedAt: null,
  });

  for (const trip of activeTrips) {
    let changed = false;

    if (trip.bufferedDeadlineAt && now > trip.bufferedDeadlineAt && !trip.safetyMessageSent) {
      trip.safetyMessageSent = true;
      trip.status = TRIP_STATUS.OVERDUE;
      changed = true;

      await createNotification({
        userId: trip.passengerId,
        title: 'Trip Delay Safety Check',
        message: 'Dear Sir, Are You Okey? If anything happened please contact us.',
        type: 'safety.overdue',
        payload: { tripId: trip._id },
      });

      await notifyAdmins({
        title: 'Overdue Trip Detected',
        message: `Trip ${trip._id} is overdue and requires review.`,
        type: 'admin.overdue-trip',
        payload: { tripId: trip._id },
      });
    }

    const lastLocationTime = trip.currentLocation?.updatedAt
      ? new Date(trip.currentLocation.updatedAt)
      : null;

    if (
      lastLocationTime &&
      !trip.suspiciousStopFlag &&
      now.getTime() - lastLocationTime.getTime() > env.safetyCheckinGraceMinutes * 60 * 1000
    ) {
      trip.suspiciousStopFlag = true;
      changed = true;

      await notifyAdmins({
        title: 'Suspicious Trip Stop',
        message: `Trip ${trip._id} has no movement updates for ${env.safetyCheckinGraceMinutes} minutes.`,
        type: 'admin.suspicious-stop',
        payload: { tripId: trip._id },
      });
    }

    if (changed) {
      await trip.save();

      if (trip.status === TRIP_STATUS.OVERDUE) {
        await RideRequest.findByIdAndUpdate(trip.rideRequestId, {
          status: 'overdue',
        });
      }
    }
  }
}

function startSafetyMonitor() {
  const pollMs = env.safetyPollMs;

  const timer = setInterval(async () => {
    try {
      await processOverdueAndStops();
    } catch (error) {
      console.error('Safety monitor failed:', error.message);
    }
  }, pollMs);

  return () => clearInterval(timer);
}

module.exports = {
  startSafetyMonitor,
  processOverdueAndStops,
};
