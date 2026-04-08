const mongoose = require('mongoose');
const dns = require('dns');
const env = require('./env');

let dnsLookupPatched = false;
let memoryServer = null;

function patchDnsLookupWithResolvers() {
  if (dnsLookupPatched) {
    return;
  }

  const originalLookup = dns.lookup.bind(dns);

  dns.lookup = function lookupWithResolvers(hostname, options, callback) {
    let resolvedOptions = options;
    let resolvedCallback = callback;

    if (typeof resolvedOptions === 'function') {
      resolvedCallback = resolvedOptions;
      resolvedOptions = {};
    }

    if (typeof resolvedCallback !== 'function') {
      return originalLookup(hostname, resolvedOptions);
    }

    const opts =
      typeof resolvedOptions === 'number'
        ? { family: resolvedOptions }
        : resolvedOptions || {};

    const family = opts.family === 6 ? 6 : 4;
    const resolveFn = family === 6 ? dns.resolve6.bind(dns) : dns.resolve4.bind(dns);

    resolveFn(hostname, (resolveError, addresses) => {
      if (!resolveError && Array.isArray(addresses) && addresses.length > 0) {
        if (opts.all) {
          resolvedCallback(
            null,
            addresses.map((address) => ({ address, family }))
          );
          return;
        }

        resolvedCallback(null, addresses[0], family);
        return;
      }

      originalLookup(hostname, resolvedOptions, resolvedCallback);
    });
  };

  dnsLookupPatched = true;
}

async function connectDatabase() {
  if (!env.mongoUri && !env.mongoFallbackUri && !env.useMemoryMongoFallback) {
    throw new Error('MONGO_URI is not configured.');
  }

  if (Array.isArray(env.dnsServers) && env.dnsServers.length > 0) {
    dns.setServers(env.dnsServers);
  }

  if (env.forcePublicDnsLookup) {
    patchDnsLookupWithResolvers();
  }

  const connectWithUri = async (uri, label) => {
    await mongoose.connect(uri, {
      dbName: env.mongoDbName,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB connected successfully (${label})`);
    return true;
  };

  const connectWithMemoryMongo = async () => {
    const { MongoMemoryServer } = require('mongodb-memory-server');

    if (!memoryServer) {
      memoryServer = await MongoMemoryServer.create({
        instance: { dbName: env.mongoDbName },
      });
    }

    const memoryUri = memoryServer.getUri();
    await mongoose.connect(memoryUri, {
      dbName: env.mongoDbName,
      serverSelectionTimeoutMS: 10000,
    });

    console.log('MongoDB connected successfully (in-memory fallback)');
    return true;
  };

  const primaryUri = env.mongoUri || '';
  const fallbackUri = env.mongoFallbackUri || '';

  if (primaryUri) {
    try {
      return await connectWithUri(primaryUri, 'primary');
    } catch (primaryError) {
      if (!fallbackUri || fallbackUri === primaryUri) {
        if (env.useMemoryMongoFallback) {
          console.warn('Primary MongoDB connection failed. Trying in-memory MongoDB fallback...');
          console.warn(primaryError.message);
          return connectWithMemoryMongo();
        }

        if (env.allowStartWithoutDb) {
          console.warn('MongoDB connection failed, continuing because ALLOW_START_WITHOUT_DB=true');
          console.warn(primaryError.message);
          return false;
        }

        throw primaryError;
      }

      console.warn('Primary MongoDB connection failed. Trying fallback URI...');
      console.warn(primaryError.message);
    }
  }

  if (fallbackUri) {
    try {
      return await connectWithUri(fallbackUri, 'fallback');
    } catch (fallbackError) {
      if (env.useMemoryMongoFallback) {
        console.warn('Fallback MongoDB connection failed. Trying in-memory MongoDB fallback...');
        console.warn(fallbackError.message);
        return connectWithMemoryMongo();
      }

      if (env.allowStartWithoutDb) {
        console.warn('MongoDB fallback connection failed, continuing because ALLOW_START_WITHOUT_DB=true');
        console.warn(fallbackError.message);
        return false;
      }

      throw fallbackError;
    }
  }

  if (env.useMemoryMongoFallback) {
    return connectWithMemoryMongo();
  }

  if (env.allowStartWithoutDb) {
    console.warn('No MongoDB URI could be used, continuing because ALLOW_START_WITHOUT_DB=true');
    return false;
  }

  throw new Error('No valid MongoDB URI is configured.');
}

module.exports = {
  connectDatabase,
};
