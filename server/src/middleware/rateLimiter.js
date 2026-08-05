import { tooManyRequests } from "../utils/httpErrors.js";

const clients = new Map();

function getClientKey(req, keyPrefix) {
  const forwardedFor = req.get("x-forwarded-for")?.split(",")[0]?.trim();
  return `${keyPrefix}:${forwardedFor || req.ip || req.socket.remoteAddress || "unknown"}`;
}

function cleanupExpired(now) {
  for (const [key, value] of clients.entries()) {
    if (value.resetAt <= now) {
      clients.delete(key);
    }
  }
}

export function createRateLimiter({ windowMs, max, keyPrefix = "api" }) {
  return (req, res, next) => {
    const now = Date.now();
    const key = getClientKey(req, keyPrefix);
    const current = clients.get(key);

    if (!current || current.resetAt <= now) {
      cleanupExpired(now);
      clients.set(key, { count: 1, resetAt: now + windowMs });
      res.setHeader("RateLimit-Limit", max);
      res.setHeader("RateLimit-Remaining", max - 1);
      return next();
    }

    current.count += 1;
    const remaining = Math.max(max - current.count, 0);
    res.setHeader("RateLimit-Limit", max);
    res.setHeader("RateLimit-Remaining", remaining);
    res.setHeader("RateLimit-Reset", Math.ceil(current.resetAt / 1000));

    if (current.count > max) {
      res.setHeader("Retry-After", Math.ceil((current.resetAt - now) / 1000));
      return next(tooManyRequests());
    }

    return next();
  };
}
