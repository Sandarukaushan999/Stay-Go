const { geocodeAddress, reverseGeocode, getRoute } = require('../services/mapService');

async function geocode(req, res) {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'query is required' });
  }

  const data = await geocodeAddress(query);
  return res.json({ data });
}

async function reverseGeocodeController(req, res) {
  const { lat, lng } = req.body;

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ message: 'lat and lng are required as numbers' });
  }

  const data = await reverseGeocode(lat, lng);
  return res.json({ data });
}

async function route(req, res) {
  const { origin, destination } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({ message: 'origin and destination are required' });
  }

  const data = await getRoute(origin, destination);
  return res.json(data);
}

module.exports = {
  geocode,
  reverseGeocode: reverseGeocodeController,
  route,
};
