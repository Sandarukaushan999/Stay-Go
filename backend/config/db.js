const mongoose = require('mongoose');

// This function connects our app to MongoDB database
// We use mongoose library to make it easy to work with MongoDB
const connectDB = async () => {
  try {
    // Try to connect using the connection string from .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, show the error and stop the server
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
