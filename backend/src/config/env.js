const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const nodeEnv = process.env.NODE_ENV || 'development';

const env = {
  nodeEnv,
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || '',
  mongoFallbackUri: process.env.MONGO_FALLBACK_URI || '',
  mongoDbName: process.env.MONGO_DB_NAME || 'stayandgo',
  useMemoryMongoFallback: process.env.USE_MEMORY_MONGO_FALLBACK === 'true',
  allowStartWithoutDb: process.env.ALLOW_START_WITHOUT_DB === 'true',
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  jwtTtl: process.env.JWT_TTL || '7d',
  nominatimBaseUrl: process.env.NOMINATIM_BASE_URL || 'https://nominatim.openstreetmap.org',
  osrmBaseUrl: process.env.OSRM_BASE_URL || 'https://router.project-osrm.org',
  safetyCheckinGraceMinutes: Number(process.env.SAFETY_CHECKIN_GRACE_MINUTES || 10),
  safetyPollMs: Number(process.env.SAFETY_POLL_MS || 30000),
  overdueBufferMinutes: Number(process.env.OVERDUE_BUFFER_MINUTES || 15),
  dnsServers: process.env.DNS_SERVERS
    ? process.env.DNS_SERVERS.split(',').map((item) => item.trim()).filter(Boolean)
    : [],
  forcePublicDnsLookup: process.env.FORCE_PUBLIC_DNS_LOOKUP !== 'false',
  apiRateLimitWindowMs: Number(process.env.API_RATE_LIMIT_WINDOW_MS || 60_000),
  apiRateLimitMax:
    Number(process.env.API_RATE_LIMIT_MAX || 0) || (nodeEnv === 'production' ? 300 : 5000),
  adminSeed: {
    email: process.env.ADMIN_EMAIL || 'admin@staygo.local',
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
    name: process.env.ADMIN_NAME || 'StayGo Admin',
  },
  riderSeed: {
    email: process.env.SEED_RIDER_EMAIL || 'rider@staygo.local',
    password: process.env.SEED_RIDER_PASSWORD || 'Rider@12345',
    name: process.env.SEED_RIDER_NAME || 'Demo Rider',
  },
  passengerSeed: {
    email: process.env.SEED_PASSENGER_EMAIL || 'passenger@staygo.local',
    password: process.env.SEED_PASSENGER_PASSWORD || 'Passenger@12345',
    name: process.env.SEED_PASSENGER_NAME || 'Demo Passenger',
  },
};

module.exports = env;
