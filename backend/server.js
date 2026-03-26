const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// ============================================
// MIDDLEWARE SETUP
// These run on every request before reaching the routes
// ============================================

// Allow frontend (running on different port) to talk to backend
app.use(cors());

// Parse JSON data from request body
app.use(express.json());

// Parse form data from request body
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static files (so frontend can display images)
app.use('/uploads', express.static('uploads'));

// ============================================
// API ROUTES
// All maintenance related endpoints start with /api/tickets
// All announcement endpoints start with /api/announcements
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/announcements', announcementRoutes);

// Simple test route to check if server is running
app.get('/api', (req, res) => {
  res.json({ message: 'STAY & GO - Maintenance API is running!' });
});

// ============================================
// START SERVER
// Connect to MongoDB first, then start listening for requests
// ============================================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
