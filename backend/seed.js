const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const Ticket = require('./models/Ticket');
const Announcement = require('./models/Announcement');

// ============================================
// SEED SCRIPT
// This script populates the database with test data for development
// Run with: node seed.js
// It creates: test users (in-memory), sample tickets, and announcements
// ============================================

// We need a simple User model for seeding
// This matches Samajith's User model structure
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seed() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!\n');

    // ---- CLEAR OLD DATA ----
    console.log('Clearing old data...');
    await Ticket.deleteMany({});
    await Announcement.deleteMany({});
    await User.deleteMany({});
    console.log('Old data cleared!\n');

    // ---- CREATE TEST USERS ----
    console.log('Creating test users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const student = await User.create({
      name: 'Kasun Perera',
      email: 'kasun@university.edu',
      password: hashedPassword,
      role: 'student',
    });

    const student2 = await User.create({
      name: 'Nimali Fernando',
      email: 'nimali@university.edu',
      password: hashedPassword,
      role: 'student',
    });

    const tech1 = await User.create({
      name: 'Nimal Silva',
      email: 'nimal@university.edu',
      password: hashedPassword,
      role: 'staff',
    });

    const tech2 = await User.create({
      name: 'Ruwan Fernando',
      email: 'ruwan@university.edu',
      password: hashedPassword,
      role: 'staff',
    });

    const tech3 = await User.create({
      name: 'Chaminda Jayasinghe',
      email: 'chaminda@university.edu',
      password: hashedPassword,
      role: 'staff',
    });

    const admin = await User.create({
      name: 'Sarah M.D.',
      email: 'sarah@university.edu',
      password: hashedPassword,
      role: 'admin',
    });

    console.log(`Created 6 users (2 students, 3 technicians, 1 admin)\n`);

    // ---- CREATE SAMPLE TICKETS ----
    console.log('Creating sample tickets...');

    const tickets = await Ticket.insertMany([
      {
        ticketId: 'MT-20260320-001',
        title: 'Broken tap in bathroom',
        category: 'plumbing',
        priority: 'high',
        hostelBlock: 'A',
        roomNumber: '204',
        description: 'The hot water tap in the shared bathroom on the second floor is leaking badly. Water is dripping continuously and the floor is getting wet which is dangerous.',
        status: 'submitted',
        submittedBy: student._id,
        statusHistory: [{ status: 'submitted', changedBy: student._id, changedAt: new Date('2026-03-20T08:30:00'), note: 'Ticket submitted by student' }],
        createdAt: new Date('2026-03-20T08:30:00'),
      },
      {
        ticketId: 'MT-20260319-003',
        title: 'Power socket not working in room',
        category: 'electrical',
        priority: 'medium',
        hostelBlock: 'B',
        roomNumber: '312',
        description: 'The power socket near the study desk stopped working since yesterday. I cannot charge my laptop or use the desk lamp. Other sockets in the room are working fine.',
        status: 'assigned',
        submittedBy: student._id,
        assignedTo: tech1._id,
        statusHistory: [
          { status: 'submitted', changedBy: student._id, changedAt: new Date('2026-03-19T14:20:00'), note: 'Ticket submitted by student' },
          { status: 'assigned', changedBy: admin._id, changedAt: new Date('2026-03-19T16:45:00'), note: 'Technician assigned by admin' },
        ],
        createdAt: new Date('2026-03-19T14:20:00'),
      },
      {
        ticketId: 'MT-20260318-002',
        title: 'WiFi connection dropping frequently',
        category: 'network',
        priority: 'high',
        hostelBlock: 'A',
        roomNumber: '105',
        description: 'The WiFi keeps disconnecting every few minutes in my room. It started after the weekend and multiple students on this floor are facing the same issue.',
        status: 'in_progress',
        submittedBy: student._id,
        assignedTo: tech2._id,
        statusHistory: [
          { status: 'submitted', changedBy: student._id, changedAt: new Date('2026-03-18T09:10:00'), note: 'Ticket submitted by student' },
          { status: 'assigned', changedBy: admin._id, changedAt: new Date('2026-03-18T10:30:00'), note: 'Technician assigned by admin' },
          { status: 'in_progress', changedBy: tech2._id, changedAt: new Date('2026-03-18T13:00:00'), note: 'Technician started working on the issue' },
        ],
        createdAt: new Date('2026-03-18T09:10:00'),
      },
      {
        ticketId: 'MT-20260317-001',
        title: 'Broken chair in study room',
        category: 'furniture',
        priority: 'low',
        hostelBlock: 'C',
        roomNumber: '401',
        description: 'One of the chairs in the common study room has a broken leg and is unstable. Someone might fall and get hurt if they try to sit on it.',
        status: 'resolved',
        submittedBy: student._id,
        assignedTo: tech3._id,
        resolutionNote: 'Replaced the broken chair leg with a new one. Chair is now stable and safe to use.',
        statusHistory: [
          { status: 'submitted', changedBy: student._id, changedAt: new Date('2026-03-17T07:45:00'), note: 'Ticket submitted by student' },
          { status: 'assigned', changedBy: admin._id, changedAt: new Date('2026-03-17T09:00:00'), note: 'Technician assigned by admin' },
          { status: 'in_progress', changedBy: tech3._id, changedAt: new Date('2026-03-17T10:30:00'), note: 'Technician started working on the issue' },
          { status: 'resolved', changedBy: tech3._id, changedAt: new Date('2026-03-17T14:00:00'), note: 'Replaced the broken chair leg with a new one.' },
        ],
        createdAt: new Date('2026-03-17T07:45:00'),
      },
      {
        ticketId: 'MT-20260315-002',
        title: 'Ceiling fan making loud noise',
        category: 'electrical',
        priority: 'medium',
        hostelBlock: 'D',
        roomNumber: '208',
        description: 'The ceiling fan in my room is making a very loud rattling noise when turned on. It vibrates a lot and I am worried it might fall down.',
        status: 'closed',
        submittedBy: student._id,
        assignedTo: tech1._id,
        resolutionNote: 'Tightened the fan mounting screws and balanced the blades. Fan is now running smoothly without noise.',
        rating: 4,
        ratingFeedback: 'Good service, fixed quickly. Thank you!',
        statusHistory: [
          { status: 'submitted', changedBy: student._id, changedAt: new Date('2026-03-15T11:20:00'), note: 'Ticket submitted by student' },
          { status: 'assigned', changedBy: admin._id, changedAt: new Date('2026-03-15T13:00:00'), note: 'Technician assigned by admin' },
          { status: 'in_progress', changedBy: tech1._id, changedAt: new Date('2026-03-15T14:30:00'), note: 'Technician started working' },
          { status: 'resolved', changedBy: tech1._id, changedAt: new Date('2026-03-15T16:00:00'), note: 'Tightened screws and balanced blades.' },
          { status: 'closed', changedBy: student._id, changedAt: new Date('2026-03-16T08:00:00'), note: 'Student rated 4/5: Good service!' },
        ],
        createdAt: new Date('2026-03-15T11:20:00'),
      },
      {
        ticketId: 'MT-20260316-001',
        title: 'Duplicate complaint test',
        category: 'other',
        priority: 'low',
        hostelBlock: 'E',
        roomNumber: '101',
        description: 'This is a test complaint that was submitted by mistake and was rejected by the admin as it was a duplicate of another existing ticket.',
        status: 'rejected',
        submittedBy: student2._id,
        rejectionReason: 'This is a duplicate of ticket MT-20260315-002. Please check your existing tickets before submitting new ones.',
        statusHistory: [
          { status: 'submitted', changedBy: student2._id, changedAt: new Date('2026-03-16T09:00:00'), note: 'Ticket submitted by student' },
          { status: 'rejected', changedBy: admin._id, changedAt: new Date('2026-03-16T09:30:00'), note: 'Duplicate of MT-20260315-002.' },
        ],
        createdAt: new Date('2026-03-16T09:00:00'),
      },
      {
        ticketId: 'MT-20260322-001',
        title: 'Water heater not heating',
        category: 'plumbing',
        priority: 'emergency',
        hostelBlock: 'A',
        roomNumber: '301',
        description: 'The water heater in the bathroom is not working at all. No hot water is coming out even after waiting for a long time. Many students need hot water for bathing.',
        status: 'submitted',
        submittedBy: student2._id,
        statusHistory: [{ status: 'submitted', changedBy: student2._id, changedAt: new Date('2026-03-22T06:15:00'), note: 'Ticket submitted by student' }],
        createdAt: new Date('2026-03-22T06:15:00'),
      },
      {
        ticketId: 'MT-20260321-001',
        title: 'Common area floor needs cleaning',
        category: 'cleaning',
        priority: 'low',
        hostelBlock: 'B',
        roomNumber: '000',
        description: 'The common area floor on the ground floor is very dirty and has not been cleaned for the past few days. It looks bad and smells unpleasant.',
        status: 'assigned',
        submittedBy: student._id,
        assignedTo: tech2._id,
        statusHistory: [
          { status: 'submitted', changedBy: student._id, changedAt: new Date('2026-03-21T10:00:00'), note: 'Ticket submitted by student' },
          { status: 'assigned', changedBy: admin._id, changedAt: new Date('2026-03-21T11:30:00'), note: 'Technician assigned by admin' },
        ],
        createdAt: new Date('2026-03-21T10:00:00'),
      },
    ]);

    console.log(`Created ${tickets.length} sample tickets\n`);

    // ---- CREATE SAMPLE ANNOUNCEMENTS ----
    console.log('Creating sample announcements...');

    const announcements = await Announcement.insertMany([
      {
        title: 'Scheduled water supply maintenance - Block A & B',
        content: 'Water supply will be temporarily cut off on Block A and Block B on 28th March from 8:00 AM to 12:00 PM for pipe maintenance work. Please store enough water before that time.',
        priority: 'urgent',
        isActive: true,
        createdBy: admin._id,
        createdAt: new Date('2026-03-25T09:00:00'),
      },
      {
        title: 'New maintenance request process update',
        content: 'From now on all maintenance requests should be submitted through the STAY & GO platform only. Phone calls and informal messages will not be accepted as official requests.',
        priority: 'important',
        isActive: true,
        createdBy: admin._id,
        createdAt: new Date('2026-03-24T14:30:00'),
      },
      {
        title: 'Monthly pest control schedule',
        content: 'Regular pest control treatment will be carried out in all hostel blocks during the first week of April. Students are requested to keep their rooms tidy and remove any food items.',
        priority: 'normal',
        isActive: true,
        createdBy: admin._id,
        createdAt: new Date('2026-03-23T11:00:00'),
      },
    ]);

    console.log(`Created ${announcements.length} sample announcements\n`);

    // ---- PRINT LOGIN CREDENTIALS ----
    console.log('========================================');
    console.log('  TEST LOGIN CREDENTIALS');
    console.log('========================================');
    console.log('  Student:    kasun@university.edu    / password123');
    console.log('  Student 2:  nimali@university.edu   / password123');
    console.log('  Technician: nimal@university.edu    / password123');
    console.log('  Technician: ruwan@university.edu    / password123');
    console.log('  Technician: chaminda@university.edu / password123');
    console.log('  Admin:      sarah@university.edu    / password123');
    console.log('========================================\n');

    console.log('Seed complete! Database is ready.');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
