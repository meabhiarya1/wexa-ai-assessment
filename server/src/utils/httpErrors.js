import { ApiError } from "./apiError.js";

export function badRequest(message, details) {
  return new ApiError(400, message, "BAD_REQUEST", details);
}

export function notFound(message) {
  return new ApiError(404, message, "NOT_FOUND");
}

export function tooManyRequests(message = "Too many requests. Please try again later.") {
  return new ApiError(429, message, "RATE_LIMITED");
}
