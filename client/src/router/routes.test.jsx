import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { ProjectsPage } from "../pages/ProjectsPage.jsx";
import { getActivePage, normalizeRoute } from "./routes.jsx";
import { useBrowserRoute } from "./useBrowserRoute.js";

describe("frontend router", () => {
  it("normalizes unknown routes to dashboard", () => {
    expect(normalizeRoute("/projects")).toBe("/projects");
    expect(normalizeRoute("/unknown")).toBe("/dashboard");
    expect(getActivePage("/projects")).toBe(ProjectsPage);
    expect(getActivePage("/missing")).toBe(DashboardPage);
  });

  it("navigates with browser history", () => {
    window.history.pushState(null, "", "/people");
    const { result } = renderHook(() => useBrowserRoute());

    expect(result.current[0]).toBe("/people");

    act(() => {
      result.current[1]("/projects");
    });

    expect(result.current[0]).toBe("/projects");
    expect(window.location.pathname).toBe("/projects");

    act(() => {
      window.history.pushState(null, "", "/bad-route");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(result.current[0]).toBe("/dashboard");
  });
});
