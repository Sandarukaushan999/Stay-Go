const axios = require('axios');
const env = require('../config/env');

function decodeOsrmGeometry(geometry = []) {
  if (!Array.isArray(geometry)) {
    return [];
  }

  return geometry.map(([lng, lat]) => [lat, lng]);
}

async function geocodeAddress(query) {
  const response = await axios.get(`${env.nominatimBaseUrl}/search`, {
    params: {
      q: query,
      format: 'jsonv2',
      addressdetails: 1,
      limit: 5,
    },
    headers: {
      'User-Agent': 'StayGo-RideSharing/1.0',
    },
    timeout: 10000,
  });

  return (response.data || []).map((entry) => ({
    lat: Number(entry.lat),
    lng: Number(entry.lon),
    addressText: entry.display_name,
  }));
}

async function reverseGeocode(lat, lng) {
  const response = await axios.get(`${env.nominatimBaseUrl}/reverse`, {
    params: {
      lat,
      lon: lng,
      format: 'jsonv2',
      addressdetails: 1,
    },
    headers: {
      'User-Agent': 'StayGo-RideSharing/1.0',
    },
    timeout: 10000,
  });

  return {
    lat: Number(response.data?.lat || lat),
    lng: Number(response.data?.lon || lng),
    addressText: response.data?.display_name || '',
  };
}

async function getRoute(origin, destination) {
  const path = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const response = await axios.get(`${env.osrmBaseUrl}/route/v1/driving/${path}`, {
    params: {
      alternatives: false,
      steps: false,
      overview: 'full',
      geometries: 'geojson',
    },
    timeout: 10000,
  });

  const route = response.data?.routes?.[0];

  if (!route) {
    throw new Error('No route found from OSRM');
  }

  return {
    distanceMeters: Number(route.distance || 0),
    expectedDurationSeconds: Number(route.duration || 0),
    routeGeometry: decodeOsrmGeometry(route.geometry?.coordinates || []),
  };
}

module.exports = {
  geocodeAddress,
  reverseGeocode,
  getRoute,
};
