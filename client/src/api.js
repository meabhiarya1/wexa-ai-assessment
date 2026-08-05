export class ApiError extends Error {
  constructor(message, status, details = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function fetchJson(path) {
  const response = await fetch(path);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(payload.message || payload.error || "Request failed.", response.status, payload);
  }

  if (payload && payload.success === true && Object.hasOwn(payload, "data")) {
    return payload.data;
  }

  return payload;
}

export function toQuery(params) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== "") {
      query.set(key, value);
    }
  }

  const text = query.toString();
  return text ? `?${text}` : "";
}
