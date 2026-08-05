import axios from "axios";

export class ApiError extends Error {
  constructor(message, status, details = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 12000,
  headers: {
    Accept: "application/json"
  }
});

apiClient.interceptors.response.use(
  (response) => {
    const payload = response.data;

    if (payload && payload.success === true && Object.hasOwn(payload, "data")) {
      return payload.data;
    }

    return payload;
  },
  (error) => {
    const payload = error.response?.data || {};
    throw new ApiError(payload.message || payload.error || "Request failed.", error.response?.status || 0, payload);
  }
);
