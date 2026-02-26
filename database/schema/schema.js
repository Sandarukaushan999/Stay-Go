// MongoDB Schema Definitions for Stay & Go Platform
// Run with: mongosh stay-go < schema.js

db = db.getSiblingDB('stay-go');

// Users collection
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password', 'role'],
      properties: {
        name: { bsonType: 'string' },
        email: { bsonType: 'string' },
        password: { bsonType: 'string' },
        role: { enum: ['student', 'driver', 'technician', 'admin'] },
        isVerified: { bsonType: 'bool' },
        isActive: { bsonType: 'bool' },
      },
    },
  },
});
db.users.createIndex({ email: 1 }, { unique: true });

// Profiles collection
db.createCollection('profiles');
db.profiles.createIndex({ user: 1 }, { unique: true });

// Matches collection
db.createCollection('matches');
db.matches.createIndex({ requester: 1, recipient: 1 }, { unique: true });

// RideOffers collection
db.createCollection('rideoffers');
db.rideoffers.createIndex({ status: 1, departureTime: 1 });

// RideRequests collection
db.createCollection('riderequests');
db.riderequests.createIndex({ ride: 1, passenger: 1 }, { unique: true });

// MaintenanceTickets collection
db.createCollection('maintenancetickets');
db.maintenancetickets.createIndex({ submittedBy: 1 });
db.maintenancetickets.createIndex({ status: 1 });

// Payments collection
db.createCollection('payments');

// Complaints collection
db.createCollection('complaints');

print('Stay & Go database schema created successfully');
