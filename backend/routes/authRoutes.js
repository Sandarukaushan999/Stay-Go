const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// ============================================
// AUTH ROUTES (for development/testing)
// These routes let us login and get JWT tokens
// In the final version, Samajith's auth module handles this
// ============================================

// Get the User model (created in seed script)
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
}, { timestamps: true }));

// Login route - returns JWT token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token with user info
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TTL || '7d' }
    );

    // Send back token and user info
    res.json({
      message: 'Login successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users with staff role (for admin to assign technicians)
router.get('/technicians', async (req, res) => {
  try {
    const technicians = await User.find({ role: 'staff' }).select('name email role');
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
