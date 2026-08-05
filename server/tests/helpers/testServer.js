import "../../src/loadEnv.js";
import { createApp } from "../../src/app.js";
import { closeDriver } from "../../src/db/neo4j.js";

export async function startTestServer() {
  const app = createApp({ enableLogging: false });
  const server = await new Promise((resolve) => {
    const runningServer = app.listen(0, "127.0.0.1", () => resolve(runningServer));
  });
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  return {
    baseUrl,
    get: (path, options = {}) => apiRequest(baseUrl, path, options),
    post: (path, options = {}) => apiRequest(baseUrl, path, { ...options, method: "POST" }),
    close: async () => {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
      await closeDriver();
    }
  };
}

async function apiRequest(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const payload = await response.json();

  return {
    response,
    payload,
    data: payload.data
  };
}
