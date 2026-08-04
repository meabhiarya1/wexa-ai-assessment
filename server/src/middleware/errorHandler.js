import { DbConfigError, DbUnavailableError } from "../db/errors.js";

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: "Route not found" });
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof DbConfigError) {
    return res.status(503).json({
      error: "CognoDB is not configured.",
      missingVars: err.missingVars
    });
  }

  if (err instanceof DbUnavailableError) {
    return res.status(503).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: "Something went wrong on our end." });
}
