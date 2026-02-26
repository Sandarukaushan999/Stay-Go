const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String, maxlength: 500 },
    university: { type: String },
    course: { type: String },
    yearOfStudy: { type: Number },
    preferences: {
      sleepSchedule: { type: String, enum: ['early_bird', 'night_owl', 'flexible'] },
      noiseLevel: { type: String, enum: ['quiet', 'moderate', 'loud'] },
      cleanliness: { type: String, enum: ['very_clean', 'moderate', 'relaxed'] },
      smoking: { type: Boolean, default: false },
      pets: { type: Boolean, default: false },
    },
    socialLinks: {
      instagram: String,
      linkedin: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
