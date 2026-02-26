const Profile = require('../models/Profile');
const Match = require('../models/Match');
const { calculateCompatibilityScore } = require('../utils/compatibility');

// @desc  Get or create my profile
// @route GET /api/roommates/profile
const getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!profile) {
      profile = await Profile.create({ user: req.user._id });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update preferences
// @route PUT /api/roommates/preferences
const updatePreferences = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { preferences: req.body, ...req.body },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get match recommendations
// @route GET /api/roommates/matches
const getMatches = async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ user: req.user._id });
    if (!myProfile) {
      return res.status(400).json({ message: 'Please set up your profile first' });
    }

    const otherProfiles = await Profile.find({ user: { $ne: req.user._id } }).populate(
      'user',
      'name email avatar'
    );

    const matches = otherProfiles.map((p) => ({
      user: p.user,
      profile: p,
      compatibilityScore: calculateCompatibilityScore(
        myProfile.preferences,
        p.preferences
      ),
    }));

    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Send match request
// @route POST /api/roommates/request/:id
const sendMatchRequest = async (req, res) => {
  try {
    const recipientId = req.params.id;
    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }

    const myProfile = await Profile.findOne({ user: req.user._id });
    const theirProfile = await Profile.findOne({ user: recipientId });
    const score = calculateCompatibilityScore(
      myProfile?.preferences,
      theirProfile?.preferences
    );

    const match = await Match.create({
      requester: req.user._id,
      recipient: recipientId,
      compatibilityScore: score,
    });
    res.status(201).json(match);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Match request already sent' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc  Respond to match request
// @route PUT /api/roommates/request/:id
const respondToRequest = async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });
    if (!match) {
      return res.status(404).json({ message: 'Match request not found' });
    }
    match.status = req.body.status;
    await match.save();
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyProfile, updatePreferences, getMatches, sendMatchRequest, respondToRequest };
