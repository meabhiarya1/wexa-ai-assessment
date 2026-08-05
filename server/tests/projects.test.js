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

test("projects list supports happy path and valid filters", async () => {
  const list = await api.get("/api/projects");
  assertApiSuccess(list.response, list.payload);
  assert.equal(list.data.length, 8);

  const filtered = await api.get("/api/projects?teamId=team-platform&status=active");
  assertApiSuccess(filtered.response, filtered.payload);
  assert.ok(Array.isArray(filtered.data));
});

test("project detail returns required skills and members", async () => {
  const result = await api.get("/api/projects/project-atlas");

  assertApiSuccess(result.response, result.payload);
  assert.equal(result.data.project.id, "project-atlas");
  assert.ok(result.data.requiredSkills.length > 0);
  assert.ok(result.data.members.length > 0);
});

test("project skill gaps endpoint returns recommendations data", async () => {
  const result = await api.get("/api/projects/project-atlas/gaps");

  assertApiSuccess(result.response, result.payload);
  assert.ok(Array.isArray(result.data));
});

test("project endpoints reject invalid params and query values", async () => {
  const invalidStatus = await api.get("/api/projects?status=blocked");
  assertApiError(invalidStatus.response, invalidStatus.payload, 400, "BAD_REQUEST");

  const invalidId = await api.get("/api/projects/atlas");
  assertApiError(invalidId.response, invalidId.payload, 400, "BAD_REQUEST");
});

test("missing project returns a structured not found error", async () => {
  const result = await api.get("/api/projects/project-not-real");

  assertApiError(result.response, result.payload, 404, "NOT_FOUND");
});
