const NodeCache = require('node-cache');

// Create cache with 10 minute standard TTL
const cache = new NodeCache({ stdTTL: 600 });

function getCached(key) {
  return cache.get(key);
}

function setCached(key, value, ttl = 600) {
  cache.set(key, value, ttl);
}

function clearCache(pattern) {
  const keys = cache.keys();
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.del(key);
    }
  });
}

// Middleware for caching GET requests
function cacheMiddleware(req, res, next) {
  if (req.method !== 'GET') {
    return next();
  }

  const key = `${req.originalUrl}`;
  const cachedResult = getCached(key);

  if (cachedResult) {
    return res.json(cachedResult);
  }

  // Override res.json to cache the response
  const originalJson = res.json.bind(res);
  res.json = function (data) {
    setCached(key, data);
    originalJson(data);
  };

  next();
}

module.exports = { cache, getCached, setCached, clearCache, cacheMiddleware };
