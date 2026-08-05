import { vi } from "vitest";
import { failure, success } from "./fixtures.js";

export function createResourceMock(matchers = []) {
  return vi.fn((path) => {
    if (!path) return success(null);

    const matcher = matchers.find(({ when }) => {
      if (typeof when === "string") return path === when;
      if (when instanceof RegExp) return when.test(path);
      return when(path);
    });

    if (matcher) return matcher.value(path);

    return failure(`Unhandled test request: ${path}`);
  });
}
