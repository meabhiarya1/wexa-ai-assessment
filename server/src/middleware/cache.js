const cacheStore = new Map();

export function cacheResponse(ttlMs, keyBuilder = defaultCacheKey) {
  return (req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }

    const key = keyBuilder(req);
    const cached = cacheStore.get(key);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
      res.setHeader("X-Cache", "HIT");
      return res.status(cached.status).json(cached.body);
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheStore.set(key, {
          status: res.statusCode,
          body,
          expiresAt: Date.now() + ttlMs
        });
      }

      res.setHeader("X-Cache", "MISS");
      return originalJson(body);
    };

    return next();
  };
}

function defaultCacheKey(req) {
  return `${req.method}:${req.originalUrl}`;
}
