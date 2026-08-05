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

test("shortest path returns graph data for connected people", async () => {
  const result = await api.get("/api/path?from=person-aanya&to=person-camila");

  assertApiSuccess(result.response, result.payload);
  assert.equal(result.data.found, true);
  assert.ok(result.data.graph.nodes.length > 0);
  assert.ok(result.data.graph.links.length > 0);
});

test("shortest path returns found false for unknown but well-formed person ids", async () => {
  const result = await api.get("/api/path?from=person-not-real&to=person-camila");

  assertApiSuccess(result.response, result.payload);
  assert.deepEqual(result.data, { found: false });
});

test("shortest path validates required and formatted ids", async () => {
  const missing = await api.get("/api/path");
  assertApiError(missing.response, missing.payload, 400, "BAD_REQUEST");

  const invalid = await api.get("/api/path?from=aanya&to=person-camila");
  assertApiError(invalid.response, invalid.payload, 400, "BAD_REQUEST");
});
