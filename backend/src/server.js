const http = require('http');
const app = require('./app');
const env = require('./config/env');
const { connectDatabase } = require('./config/database');
const { initializeSocket } = require('./config/socket');
const { seedDemoUsers } = require('./bootstrap/seedDemoUsers');
const { startSafetyMonitor } = require('./services/safetyService');

async function start() {
  try {
    const dbConnected = await connectDatabase();
    if (dbConnected) {
      await seedDemoUsers();
    } else {
      console.warn('Skipping demo user seeding because database is not connected.');
    }

    const server = http.createServer(app);
    initializeSocket(server, env.clientUrl);
    if (dbConnected) {
      startSafetyMonitor();
    }

    server.listen(env.port, () => {
      console.log(`Stay-Go backend running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
}

start();
