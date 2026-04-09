require('dotenv').config();

const mongoose = require('mongoose');
const {connectDatabase} = require('../config/database');

// Models
const StudentProfile = require('../models/StudentProfile');
const RoomPreference = require('../models/RoomPreference');
const Room = require('../models/Room');
const MatchRequest = require('../models/MatchRequest');
const MatchPair = require('../models/MatchPair');
const Notification = require('../models/RoommateNotification');
const IssueReport = require('../models/IssueReport');

// Seed data
const {
    students,
    roomPreferences,
    rooms,
    matchRequests,
    notifications,
    issueReports,
} = require('./seedData');

async function seed() {
    try {
        await connectDatabase();
        console.log('Connected to database. Seeding...\n');

        // Clear existing data
        await StudentProfile.deleteMany({});
        await RoomPreference.deleteMany({});
        await Room.deleteMany({});
        await MatchRequest.deleteMany({});
        await MatchPair.deleteMany({});
        await Notification.deleteMany({});
        await IssueReport.deleteMany({});
        console.log('Cleared existing data.');

        // Insert seed data
        const seededStudents = await StudentProfile.insertMany(students);
        console.log(`Seeded ${seededStudents.length} students.`);

        const seededPrefs = await RoomPreference.insertMany(roomPreferences);
        console.log(`Seeded ${seededPrefs.length} room preferences.`);

        const seededRooms = await Room.insertMany(rooms);
        console.log(`Seeded ${seededRooms.length} rooms.`);

        const seededRequests = await MatchRequest.insertMany(matchRequests);
        console.log(`Seeded ${seededRequests.length} match requests.`);

        const seededNotifs = await Notification.insertMany(notifications);
        console.log(`Seeded ${seededNotifs.length} notifications.`);

        const seededIssues = await IssueReport.insertMany(issueReports);
        console.log(`Seeded ${seededIssues.length} issue reports.`);

        console.log('\n✅ Seeding complete!');
        console.log('\n--- Quick reference for dev auth headers ---');
        console.log('First student (Ashan):');
        console.log(`  x-student-id: ${seededStudents[0]._id}`);
        console.log('  x-role: student');
        console.log('\nUse any student _id as x-student-id in your requests.');
        console.log('Set x-role to "admin" for admin-only endpoints.\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

seed();
