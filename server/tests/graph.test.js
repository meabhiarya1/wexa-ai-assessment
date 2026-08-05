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

test("network graph returns nodes and relationships", async () => {
  const result = await api.get("/api/graph");

  assertApiSuccess(result.response, result.payload);
  assert.ok(result.data.nodes.length > 0);
  assert.ok(result.data.links.length > 0);
});

test("network graph supports valid team filtering", async () => {
  const result = await api.get("/api/graph?teamId=team-platform");

  assertApiSuccess(result.response, result.payload);
  assert.ok(result.data.nodes.length > 0);
  assert.ok(result.data.links.length > 0);
});

test("network graph rejects invalid team filters", async () => {
  const result = await api.get("/api/graph?teamId=platform");

  assertApiError(result.response, result.payload, 400, "BAD_REQUEST");
});

test("expensive graph/search routes enforce rate limiting", async () => {
  let result;
  const headers = { "x-forwarded-for": "203.0.113.188" };

  for (let index = 0; index < 61; index += 1) {
    result = await api.get("/api/search?q=a", { headers });
  }

  assertApiError(result.response, result.payload, 429, "RATE_LIMITED");
});
