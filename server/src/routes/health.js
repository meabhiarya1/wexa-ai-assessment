import { Router } from "express";
import { checkConnectivity } from "../db/neo4j.js";

const router = Router();

router.get("/", async (_req, res) => {
  const database = await checkConnectivity();

  res.status(database.ok ? 200 : 503).json({
    ok: database.ok,
    service: "talentgraph-api",
    database
  });
});

export default router;
