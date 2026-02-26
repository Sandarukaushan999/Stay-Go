// Seed data for Stay & Go Platform
// Run with: mongosh stay-go < seed.js
// NOTE: Passwords here are bcrypt hashes. Use bcrypt to hash before inserting in production.

db = db.getSiblingDB('stay-go');

// Clear existing data
db.users.deleteMany({});
db.profiles.deleteMany({});

// Insert sample users (passwords are hashed: 'password123')
db.users.insertMany([
  {
    name: 'Admin User',
    email: 'admin@staygo.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lF36',
    role: 'admin',
    isVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Alice Student',
    email: 'alice@university.edu',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lF36',
    role: 'student',
    isVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Bob Driver',
    email: 'bob@driver.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lF36',
    role: 'driver',
    isVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Carol Tech',
    email: 'carol@hostel.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lF36',
    role: 'technician',
    isVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

print('Seed data inserted successfully');
print('Default password for all users: password123');
