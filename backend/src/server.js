const http = require('http');
const https = require('https');
const app = require('./app');
const env = require('./config/env');
const { connectDatabase } = require('./config/database');
const { initializeSocket } = require('./config/socket');
const { seedDemoUsers } = require('./bootstrap/seedDemoUsers');
const { startSafetyMonitor } = require('./services/safetyService');

function getPublicIp() {
  return new Promise((resolve) => {
    https
      .get('https://api.ipify.org?format=json', (res) => {
        let raw = '';
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(raw);
            resolve(parsed.ip || null);
          } catch {
            resolve(null);
          }
        });
      })
      .on('error', () => resolve(null));
  });
}

function printMongoSelectionDiagnostics(error) {
  if (!error?.reason?.servers || !(error.reason.servers instanceof Map)) {
    return;
  }

  console.error('MongoDB server selection details:');
  for (const [server, description] of error.reason.servers.entries()) {
    const serverError = description?.error;
    const message = serverError?.message || 'Unknown server error';
    console.error(`- ${server}: ${message}`);
  }
}

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
    printMongoSelectionDiagnostics(error);

    if (error?.name?.includes('ServerSelectionError')) {
      const publicIp = await getPublicIp();
      if (publicIp) {
        console.error(`Detected public IP: ${publicIp}`);
      }

      console.error('Atlas checklist:');
      console.error('1) Atlas > Network Access > add this public IP (or 0.0.0.0/0 for testing).');
      console.error('2) Atlas > Database Access > verify user/password and readWrite role.');
      console.error('3) Atlas cluster must be running (not paused).');
    }

    process.exit(1);
  }
}

start();
