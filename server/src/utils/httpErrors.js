export class HttpError extends Error {
  constructor(status, code, message, details = undefined) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function badRequest(message, details) {
  return new HttpError(400, "BAD_REQUEST", message, details);
}

export function notFound(message) {
  return new HttpError(404, "NOT_FOUND", message);
}

export function tooManyRequests(message = "Too many requests. Please try again later.") {
  return new HttpError(429, "RATE_LIMITED", message);
}
