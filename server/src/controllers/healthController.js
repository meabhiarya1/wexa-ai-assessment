import { checkConnectivity } from "../db/neo4j.js";

export async function getHealth(_req, res) {
  const database = await checkConnectivity();

  res.status(database.ok ? 200 : 503).json({
    ok: database.ok,
    service: "talentgraph-api",
    database
  });
}
