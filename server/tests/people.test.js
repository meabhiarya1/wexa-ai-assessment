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
  assert.equal(list.data.items.length, 8);
  assert.equal(list.data.pagination.total, 18);
  assert.equal(list.data.pagination.page, 1);
  assert.equal(list.data.pagination.hasNextPage, true);

  const filtered = await api.get("/api/people?teamId=team-platform&skillId=skill-react");
  assertApiSuccess(filtered.response, filtered.payload);
  assert.ok(Array.isArray(filtered.data.items));
  assert.ok(filtered.data.pagination.total >= 0);
});

test("people list supports pagination", async () => {
  const result = await api.get("/api/people?page=2&limit=5");

  assertApiSuccess(result.response, result.payload);
  assert.equal(result.data.items.length, 5);
  assert.equal(result.data.pagination.page, 2);
  assert.equal(result.data.pagination.limit, 5);
  assert.equal(result.data.pagination.hasPreviousPage, true);
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

  const invalidPage = await api.get("/api/people?page=0");
  assertApiError(invalidPage.response, invalidPage.payload, 400, "BAD_REQUEST");

  const invalidLimit = await api.get("/api/people?limit=51");
  assertApiError(invalidLimit.response, invalidLimit.payload, 400, "BAD_REQUEST");
});

test("missing person returns a structured not found error", async () => {
  const result = await api.get("/api/people/person-not-real");

  assertApiError(result.response, result.payload, 404, "NOT_FOUND");
});
