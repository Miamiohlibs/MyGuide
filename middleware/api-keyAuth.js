// Middleware to authenticate API requests using an ID and API key
const config = require('config');
const Logger = require('../helpers/Logger');

module.exports = function (req, res, next) {
  try {
    const expectedId = config.get('apiAuth.id'); // e.g., 'myuser'
    const expectedKey = config.get('apiAuth.apiKey'); // e.g., 'supersecret123'
    if (!expectedId || !expectedKey) {
      return res.status(500).json({ error: 'API credentials not configured' });
    }
    const id = req.query.id || req.headers['x-api-id'];
    const apiKey = req.query.apiKey || req.headers['x-api-key'];

    if (id === expectedId && apiKey === expectedKey) {
      return next();
    }
  } catch (error) {
    Logger.error('API credentials not configured:', error);
  }
  res.status(401).json({ error: 'Unauthorized: Invalid API credentials' });
};
