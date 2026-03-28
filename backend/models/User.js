const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'technitian', 'rider', 'admin'],
    required: true
  },
  fullName: { type: String },
  email: { type: String }
});

module.exports = mongoose.model('User', userSchema);