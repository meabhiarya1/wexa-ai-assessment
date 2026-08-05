import "../src/loadEnv.js";
import { checkConnectivity, closeDriver, runWrite } from "../src/db/neo4j.js";
import { migrations } from "../migrations/index.js";

async function main() {
  console.log("Checking CognoDB connectivity...");
  const connectivity = await checkConnectivity();

  if (!connectivity.ok) {
    console.error(connectivity.message);
    process.exitCode = 1;
    return;
  }

  for (const migration of migrations) {
    console.log(`Running migration ${migration.id}: ${migration.description}`);
    await migration.up({ runWrite });
  }

  console.log(`Migrations complete: ${migrations.length} migration(s) applied safely.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDriver();
  });
