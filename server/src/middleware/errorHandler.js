import { DbConfigError, DbUnavailableError } from "../db/errors.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export function notFoundHandler(req, res) {
  sendError(res, 404, "Route not found", "ROUTE_NOT_FOUND", undefined, req.id);
}

export function errorHandler(err, req, res, _next) {
  if (err instanceof ApiError) {
    return sendError(res, err.statusCode, err.message, err.code, err.details, req.id);
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return sendError(res, 400, "Malformed JSON request body.", "BAD_JSON", undefined, req.id);
  }

  if (err instanceof DbConfigError) {
    return sendError(
      res,
      503,
      "CognoDB is not configured.",
      "COGNODB_MISCONFIGURED",
      { missingVars: err.missingVars },
      req.id
    );
  }

  if (err instanceof DbUnavailableError) {
    return sendError(res, 503, err.message, "COGNODB_UNAVAILABLE", undefined, req.id);
  }

  console.error(err);
  return sendError(res, 500, "Something went wrong on our end.", "INTERNAL_SERVER_ERROR", undefined, req.id);
}

function sendError(res, statusCode, message, code, details, requestId) {
  const response = new ApiResponse(statusCode, null, message);
  response.success = false;
  response.error = details ? { code, details } : { code };
  response.requestId = requestId;

  return res.status(statusCode).json(response);
}
