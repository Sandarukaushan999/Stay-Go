const RideOffer = require('../models/RideOffer');
const RideRequest = require('../models/RideRequest');

// @desc  List open rides
// @route GET /api/rides
const listRides = async (req, res) => {
  try {
    const rides = await RideOffer.find({ status: 'open' })
      .populate('driver', 'name avatar')
      .sort({ departureTime: 1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create ride offer
// @route POST /api/rides
const createRide = async (req, res) => {
  try {
    const ride = await RideOffer.create({ ...req.body, driver: req.user._id });
    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Request to join a ride
// @route POST /api/rides/:id/request
const requestRide = async (req, res) => {
  try {
    const ride = await RideOffer.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.status !== 'open') {
      return res.status(400).json({ message: 'Ride is not available' });
    }
    if (ride.driver.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot request your own ride' });
    }
    const existing = await RideRequest.findOne({ ride: ride._id, passenger: req.user._id });
    if (existing) {
      return res.status(409).json({ message: 'Already requested this ride' });
    }
    const rideRequest = await RideRequest.create({
      ride: ride._id,
      passenger: req.user._id,
    });
    res.status(201).json(rideRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update ride status
// @route PUT /api/rides/:id/status
const updateRideStatus = async (req, res) => {
  try {
    const ride = await RideOffer.findOne({ _id: req.params.id, driver: req.user._id });
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    ride.status = req.body.status;
    await ride.save();
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listRides, createRide, requestRide, updateRideStatus };
