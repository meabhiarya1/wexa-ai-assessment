import test from "node:test";
import assert from "node:assert/strict";
import { assertApiSuccess } from "./helpers/assertions.js";
import { startTestServer } from "./helpers/testServer.js";

let api;

test.before(async () => {
  api = await startTestServer();
});

test.after(async () => {
  await api.close();
});

test("stats endpoint returns seeded graph counts", async () => {
  const result = await api.get("/api/stats");

  assertApiSuccess(result.response, result.payload);
  assert.deepEqual(result.data, {
    people: 18,
    teams: 6,
    skills: 24,
    projects: 8,
    relationships: 134
  });
});

test("stats endpoint includes cache and request tracing headers", async () => {
  await api.get("/api/stats");
  const result = await api.get("/api/stats");

  assertApiSuccess(result.response, result.payload);
  assert.equal(result.response.headers.get("x-cache"), "HIT");
  assert.ok(result.response.headers.get("x-request-id"));
});
