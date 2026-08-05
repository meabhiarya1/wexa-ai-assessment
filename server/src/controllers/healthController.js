import { checkConnectivity } from "../db/neo4j.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function getHealth(_req, res) {
  return getDbHealth(_req, res);
}

export async function getLive(_req, res) {
  sendSuccess(res, {
    ok: true,
    service: "talentgraph-api",
    status: "live",
    uptimeSeconds: Math.round(process.uptime())
  }, "API is live.");
}

export async function getDbHealth(_req, res) {
  const database = await checkConnectivity();
  const statusCode = database.ok ? 200 : 503;

  sendSuccess(res, {
    ok: database.ok,
    service: "talentgraph-api",
    database
  }, database.ok ? "CognoDB is connected." : "CognoDB is not available.", statusCode);
}

export async function getReady(_req, res) {
  const database = await checkConnectivity();
  const statusCode = database.ok ? 200 : 503;

  sendSuccess(res, {
    ok: database.ok,
    service: "talentgraph-api",
    status: database.ok ? "ready" : "not_ready",
    checks: {
      database
    }
  }, database.ok ? "API is ready." : "API is not ready.", statusCode);
}
