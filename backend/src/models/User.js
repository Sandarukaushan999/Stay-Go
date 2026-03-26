const mongoose = require('mongoose');
const { ROLES } = require('../constants/roles');

const locationSchema = new mongoose.Schema(
  {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    addressText: { type: String, default: '' },
  },
  { _id: false }
);

const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    contactNumber: { type: String, default: '' },
    gender: { type: String, default: '' },
    address: { type: String, default: '' },
    studentId: { type: String, default: '' },
    campusId: { type: String, default: '' },

    hostelLocation: { type: locationSchema, default: () => ({}) },
    pickupLocation: { type: locationSchema, default: () => ({}) },

    vehicleNumber: { type: String, default: '' },
    vehicleType: { type: String, default: '' },
    seatCount: { type: Number, default: 0 },
    availability: { type: String, default: 'offline' },

    emergencyContact: { type: emergencyContactSchema, default: () => ({}) },

    isVerified: { type: Boolean, default: false, index: true },
    isOnline: { type: Boolean, default: false, index: true },
    isBlocked: { type: Boolean, default: false, index: true },
    rating: { type: Number, default: 0 },
    complaintCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    role: this.role,
    name: this.name,
    email: this.email,
    contactNumber: this.contactNumber,
    gender: this.gender,
    address: this.address,
    studentId: this.studentId,
    campusId: this.campusId,
    hostelLocation: this.hostelLocation,
    pickupLocation: this.pickupLocation,
    vehicleNumber: this.vehicleNumber,
    vehicleType: this.vehicleType,
    seatCount: this.seatCount,
    availability: this.availability,
    emergencyContact: this.emergencyContact,
    isVerified: this.isVerified,
    isOnline: this.isOnline,
    isBlocked: this.isBlocked,
    rating: this.rating,
    complaintCount: this.complaintCount,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('User', userSchema);
