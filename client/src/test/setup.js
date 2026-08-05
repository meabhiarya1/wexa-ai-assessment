import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import React from "react";
import { afterEach, vi } from "vitest";

class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe(element) {
    this.callback([{ contentRect: { width: element.clientWidth || 900 } }]);
  }

  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = MockResizeObserver;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

vi.mock("react-force-graph-2d", () => ({
  default: React.forwardRef(function MockForceGraph2D({ graphData }, ref) {
    React.useImperativeHandle(ref, () => ({
      zoom: vi.fn(() => 1),
      zoomToFit: vi.fn()
    }));

    return React.createElement("div", {
      "data-testid": "force-graph",
      "data-links": graphData?.links?.length || 0,
      "data-nodes": graphData?.nodes?.length || 0
    });
  })
}));
