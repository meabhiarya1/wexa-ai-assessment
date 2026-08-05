import "./loadEnv.js";
import { getServerConfig } from "./config.js";
import { closeDriver } from "./db/neo4j.js";
import { createApp } from "./app.js";

const app = createApp();
const { port, clientOrigin } = getServerConfig();

const server = app.listen(port, () => {
  console.log(`TalentGraph API listening on ${clientOrigin} on port ${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received. Closing TalentGraph API...`);
  server.close(async () => {
    await closeDriver();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
