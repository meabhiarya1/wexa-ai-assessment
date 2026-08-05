import { checkConnectivity } from "../db/neo4j.js";

export async function getHealth(_req, res) {
  return getDbHealth(_req, res);
}

export async function getLive(_req, res) {
  res.json({
    ok: true,
    service: "talentgraph-api",
    status: "live",
    uptimeSeconds: Math.round(process.uptime())
  });
}

export async function getDbHealth(_req, res) {
  const database = await checkConnectivity();

  res.status(database.ok ? 200 : 503).json({
    ok: database.ok,
    service: "talentgraph-api",
    database
  });
}

export async function getReady(_req, res) {
  const database = await checkConnectivity();

  res.status(database.ok ? 200 : 503).json({
    ok: database.ok,
    service: "talentgraph-api",
    status: database.ok ? "ready" : "not_ready",
    checks: {
      database
    }
  });
}
