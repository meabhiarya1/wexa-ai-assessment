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

test("search returns people, projects, or skills for a valid term", async () => {
  const result = await api.get("/api/search?q=React");

  assertApiSuccess(result.response, result.payload);
  assert.ok(result.data.length > 0);
  assert.ok(result.data.every((item) => item.id && item.label && item.type));
});

test("short search terms return an empty success response", async () => {
  const result = await api.get("/api/search?q=a");

  assertApiSuccess(result.response, result.payload);
  assert.deepEqual(result.data, []);
});

test("overlong search terms are rejected", async () => {
  const result = await api.get(`/api/search?q=${"a".repeat(81)}`);

  assertApiError(result.response, result.payload, 400, "BAD_REQUEST");
});
