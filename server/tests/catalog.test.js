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

test("teams and skills endpoints return catalog data", async () => {
  const teams = await api.get("/api/teams");
  assertApiSuccess(teams.response, teams.payload);
  assert.equal(teams.data.length, 6);
  assert.ok(teams.data.every((team) => team.id && team.name));

  const skills = await api.get("/api/skills");
  assertApiSuccess(skills.response, skills.payload);
  assert.equal(skills.data.length, 24);
  assert.ok(skills.data.every((skill) => skill.id && skill.name && skill.category));
});

test("catalog endpoints use read cache on repeated requests", async () => {
  await api.get("/api/teams");
  const cached = await api.get("/api/teams");

  assertApiSuccess(cached.response, cached.payload);
  assert.equal(cached.response.headers.get("x-cache"), "HIT");
});
