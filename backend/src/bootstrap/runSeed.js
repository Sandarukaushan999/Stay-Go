const { connectDatabase } = require('../config/database');
const { seedDemoUsers } = require('./seedDemoUsers');

async function run() {
  try {
    await connectDatabase();
    const seeded = await seedDemoUsers();
    console.log('Seed complete:', {
      admin: seeded.admin.email,
      rider: seeded.rider.email,
      passenger: seeded.passenger.email,
    });
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

run();
