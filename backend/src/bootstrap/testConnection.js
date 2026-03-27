const https = require('https');
const { connectDatabase } = require('../config/database');
const mongoose = require('mongoose');

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

async function run() {
  const publicIp = await getPublicIp();
  if (publicIp) {
    console.log(`Detected public IP: ${publicIp}`);
  }

  try {
    const ok = await connectDatabase();
    if (!ok) {
      console.error('Database not connected (ALLOW_START_WITHOUT_DB might be true).');
      process.exit(1);
    }

    const ping = await mongoose.connection.db.admin().ping();
    console.log('MongoDB connection success:', ping);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.error('Checklist: Atlas cluster running, IP allowed in Network Access, correct DB user/password.');
    process.exit(1);
  }
}

run();
