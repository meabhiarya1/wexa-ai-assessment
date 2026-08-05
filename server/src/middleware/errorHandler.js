import { DbConfigError, DbUnavailableError } from "../db/errors.js";
import { HttpError } from "../utils/httpErrors.js";

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: "Route not found",
    code: "ROUTE_NOT_FOUND",
    requestId: req.id
  });
}

export function errorHandler(err, req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message,
      code: err.code,
      details: err.details,
      requestId: req.id
    });
  }

  if (err instanceof DbConfigError) {
    return res.status(503).json({
      error: "CognoDB is not configured.",
      code: "COGNODB_MISCONFIGURED",
      missingVars: err.missingVars,
      requestId: req.id
    });
  }

  if (err instanceof DbUnavailableError) {
    return res.status(503).json({
      error: err.message,
      code: "COGNODB_UNAVAILABLE",
      requestId: req.id
    });
  }

  console.error(err);
  return res.status(500).json({
    error: "Something went wrong on our end.",
    code: "INTERNAL_SERVER_ERROR",
    requestId: req.id
  });
}
