const { connectDatabase } = require('../config/database');
const { seedDemoUsers } = require('./seedDemoUsers');
const { seedMaintenanceData } = require('./seedMaintenanceData');

async function run() {
  try {
    await connectDatabase();

    // Seed team's demo users (admin, rider, passenger)
    const seeded = await seedDemoUsers();
    console.log('Team demo users seeded:', {
      admin: seeded.admin.email,
      rider: seeded.rider.email,
      passenger: seeded.passenger.email,
    });

    // Seed maintenance module data (students, technicians, tickets, announcements)
    const maintenance = await seedMaintenanceData();
    console.log('Maintenance data seeded:', {
      students: maintenance.students.length,
      technicians: maintenance.technicians.length,
      admin: maintenance.admin.email,
    });

    console.log('\n========================================');
    console.log('  MAINTENANCE TEST CREDENTIALS');
    console.log('========================================');
    console.log('  Student:    kasun@university.edu    / password123');
    console.log('  Student 2:  nimali@university.edu   / password123');
    console.log('  Technician: nimal@university.edu    / password123');
    console.log('  Technician: ruwan@university.edu    / password123');
    console.log('  Technician: chaminda@university.edu / password123');
    console.log('  Admin:      sarah@university.edu    / password123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

run();
