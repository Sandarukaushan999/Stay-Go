const mongoose = require('mongoose');
const dns = require('dns');
const env = require('./env');

let dnsLookupPatched = false;

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
  if (!env.mongoUri) {
    throw new Error('MONGO_URI is not configured.');
  }

  try {
    if (Array.isArray(env.dnsServers) && env.dnsServers.length > 0) {
      dns.setServers(env.dnsServers);
    }

    if (env.forcePublicDnsLookup) {
      patchDnsLookupWithResolvers();
    }

    await mongoose.connect(env.mongoUri, {
      dbName: env.mongoDbName,
      serverSelectionTimeoutMS: 10000,
    });

    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    if (env.allowStartWithoutDb) {
      console.warn('MongoDB connection failed, continuing because ALLOW_START_WITHOUT_DB=true');
      console.warn(error.message);
      return false;
    }

    throw error;
  }
}

module.exports = {
  connectDatabase,
};
