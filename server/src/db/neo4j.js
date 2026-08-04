import neo4j from "neo4j-driver";
import { getMissingDatabaseVars, getServerConfig } from "../config.js";
import { DbConfigError, DbUnavailableError } from "./errors.js";

let driver;

function createDriver() {
  const missingVars = getMissingDatabaseVars();
  if (missingVars.length > 0) {
    throw new DbConfigError(missingVars);
  }

  const { database } = getServerConfig();

  return neo4j.driver(database.uri, neo4j.auth.basic(database.username, database.password), {
    disableLosslessIntegers: true,
    maxConnectionPoolSize: 10
  });
}

export function getDriver() {
  if (!driver) {
    driver = createDriver();
  }
  return driver;
}

async function withSession(mode, work) {
  let session;
  try {
    session = getDriver().session({ defaultAccessMode: mode });
    return await work(session);
  } catch (error) {
    if (error instanceof DbConfigError) {
      throw error;
    }
    throw new DbUnavailableError(error);
  } finally {
    await session?.close();
  }
}

export async function runRead(cypher, params = {}) {
  return withSession(neo4j.session.READ, async (session) => {
    const result = await session.executeRead((tx) => tx.run(cypher, params));
    return result.records.map((record) => record.toObject());
  });
}

export async function runWrite(cypher, params = {}) {
  return withSession(neo4j.session.WRITE, async (session) => {
    const result = await session.executeWrite((tx) => tx.run(cypher, params));
    return result.records.map((record) => record.toObject());
  });
}

export async function checkConnectivity() {
  const missingVars = getMissingDatabaseVars();
  if (missingVars.length > 0) {
    return {
      ok: false,
      status: "misconfigured",
      message: `Missing CognoDB environment variables: ${missingVars.join(", ")}.`
    };
  }

  try {
    await getDriver().verifyConnectivity();
    return {
      ok: true,
      status: "connected",
      message: "Connected to CognoDB."
    };
  } catch (error) {
    return {
      ok: false,
      status: "unreachable",
      message: "Could not reach CognoDB with the current settings.",
      detail: error.message
    };
  }
}

export function nodeProps(node) {
  return node.properties;
}

export async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = undefined;
  }
}
