import { ApiError, apiClient } from "./lib/apiClient.js";

export { ApiError };

export async function fetchJson(path, options = {}) {
  return apiClient.get(path, options);
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
