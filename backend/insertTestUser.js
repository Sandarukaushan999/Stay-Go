const mongoose = require('mongoose');
const User = require('./models/User');

async function insertTestUser() {
  await mongoose.connect('mongodb://127.0.0.1:27017/hostelDB');
  const user = new User({
    username: 'testuser',
    password: 'testpass',
    role: 'student',
    fullName: 'Test User',
    email: 'testuser@example.com',
    phone: '0771234567',
    address: 'Colombo',
    profileImage: ''
  });
  await user.save();
  console.log('Test user inserted:', user);
  await mongoose.disconnect();
}

insertTestUser().catch(console.error);