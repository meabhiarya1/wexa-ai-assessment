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

test("bridge insight returns limited bridge people", async () => {
  const result = await api.get("/api/insights/bridges?limit=3");

  assertApiSuccess(result.response, result.payload);
  assert.ok(result.data.length <= 3);
  assert.ok(result.data.every((person) => person.id && person.homeTeam && person.connectedTeam));
});

test("bridge insight rejects invalid limits", async () => {
  const notNumber = await api.get("/api/insights/bridges?limit=abc");
  assertApiError(notNumber.response, notNumber.payload, 400, "BAD_REQUEST");

  const tooLarge = await api.get("/api/insights/bridges?limit=26");
  assertApiError(tooLarge.response, tooLarge.payload, 400, "BAD_REQUEST");
});
