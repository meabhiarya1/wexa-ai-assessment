import test from "node:test";
import { assertApiError } from "./helpers/assertions.js";
import { startTestServer } from "./helpers/testServer.js";

let api;

test.before(async () => {
  api = await startTestServer();
});

test.after(async () => {
  await api.close();
});

test("unsupported methods return structured route errors", async () => {
  const result = await api.post("/api/people");

  assertApiError(result.response, result.payload, 404, "ROUTE_NOT_FOUND");
});

test("malformed JSON request bodies return structured bad request errors", async () => {
  const result = await api.post("/api/people", {
    headers: { "content-type": "application/json" },
    body: "{"
  });

  assertApiError(result.response, result.payload, 400, "BAD_JSON");
});
