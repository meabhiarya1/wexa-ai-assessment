import test from "node:test";
import assert from "node:assert/strict";
import { assertApiError, assertApiSuccess } from "./helpers/assertions.js";
import { startTestServer } from "./helpers/testServer.js";

let api;

test.before(async () => {
  api = await startTestServer();
});

test.after(async () => {
  await api.close();
});

test("health endpoints return liveness, database health, and readiness", async () => {
  const live = await api.get("/api/health/live");
  assertApiSuccess(live.response, live.payload);
  assert.equal(live.data.status, "live");

  const db = await api.get("/api/health");
  assertApiSuccess(db.response, db.payload);
  assert.equal(db.data.database.status, "connected");

  const ready = await api.get("/api/ready");
  assertApiSuccess(ready.response, ready.payload);
  assert.equal(ready.data.status, "ready");
});

test("unknown API routes return structured 404 errors", async () => {
  const result = await api.get("/api/not-real");
  assertApiError(result.response, result.payload, 404, "ROUTE_NOT_FOUND");
});
