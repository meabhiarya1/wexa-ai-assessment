import assert from "node:assert/strict";

export function assertApiSuccess(response, payload, expectedStatus = 200) {
  assert.equal(response.status, expectedStatus);
  assert.equal(payload.statusCode, expectedStatus);
  assert.equal(payload.success, true);
  assert.equal(typeof payload.message, "string");
  assert.equal(Object.hasOwn(payload, "data"), true);
  assert.ok(response.headers.get("x-request-id"));
}

export function assertApiError(response, payload, expectedStatus, expectedCode) {
  assert.equal(response.status, expectedStatus);
  assert.equal(payload.statusCode, expectedStatus);
  assert.equal(payload.success, false);
  assert.equal(payload.data, null);
  assert.equal(payload.error?.code, expectedCode);
  assert.equal(typeof payload.message, "string");
  assert.equal(typeof payload.requestId, "string");
  assert.ok(response.headers.get("x-request-id"));
}
