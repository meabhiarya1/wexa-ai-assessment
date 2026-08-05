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

test("people list supports happy path and valid filters", async () => {
  const list = await api.get("/api/people");
  assertApiSuccess(list.response, list.payload);
  assert.equal(list.data.length, 18);

  const filtered = await api.get("/api/people?teamId=team-platform&skillId=skill-react");
  assertApiSuccess(filtered.response, filtered.payload);
  assert.ok(Array.isArray(filtered.data));
});

test("person profile returns skills, projects, and mentorship", async () => {
  const result = await api.get("/api/people/person-aanya");

  assertApiSuccess(result.response, result.payload);
  assert.equal(result.data.person.id, "person-aanya");
  assert.ok(result.data.skills.length > 0);
  assert.ok(result.data.projects.length > 0);
  assert.ok(Array.isArray(result.data.mentors));
  assert.ok(Array.isArray(result.data.mentees));
});

test("person collaborators endpoint returns shared project collaborators", async () => {
  const result = await api.get("/api/people/person-aanya/collaborators");

  assertApiSuccess(result.response, result.payload);
  assert.ok(Array.isArray(result.data));
});

test("people endpoints reject invalid ids and filters", async () => {
  const invalidFilter = await api.get("/api/people?teamId=bad-team");
  assertApiError(invalidFilter.response, invalidFilter.payload, 400, "BAD_REQUEST");

  const invalidId = await api.get("/api/people/aanya");
  assertApiError(invalidId.response, invalidId.payload, 400, "BAD_REQUEST");
});

test("missing person returns a structured not found error", async () => {
  const result = await api.get("/api/people/person-not-real");

  assertApiError(result.response, result.payload, 404, "NOT_FOUND");
});
