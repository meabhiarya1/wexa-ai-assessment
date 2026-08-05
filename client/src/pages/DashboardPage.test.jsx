import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DashboardPage } from "./DashboardPage.jsx";
import { useResource } from "../hooks/useResource.js";
import { createResourceMock } from "../test/mockResource.js";
import { failure, people, success } from "../test/fixtures.js";

vi.mock("../hooks/useResource.js", () => ({
  useResource: vi.fn()
}));

vi.mock("../hooks/useDebouncedValue.js", () => ({
  useDebouncedValue: (value) => value
}));

describe("DashboardPage", () => {
  it("renders stats, bridge insight, and debounced search results", async () => {
    const user = userEvent.setup();

    useResource.mockImplementation(
      createResourceMock([
        {
          when: "/api/stats",
          value: () => success({ people: 12, teams: 4, skills: 18, projects: 7, relationships: 42 })
        },
        {
          when: "/api/insights/bridges",
          value: () =>
            success([
              {
                ...people[0],
                homeTeam: { name: "Platform Engineering" },
                connectedTeam: { id: "team-growth", name: "Growth" }
              }
            ])
        },
        {
          when: (path) => path.startsWith("/api/search"),
          value: (path) =>
            success(
              path.includes("q=React")
                ? [{ id: "skill-react", type: "Skill", label: "React", sublabel: "Frontend skill" }]
                : []
            )
        }
      ])
    );

    render(<DashboardPage />);

    expect(screen.getByText("People")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Aanya Mehta")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/try react/i), "React");

    expect(await screen.findByText("Frontend skill")).toBeInTheDocument();
    expect(useResource).toHaveBeenCalledWith("/api/search?q=React", ["React"]);
  });

  it("shows API errors with retry affordance", () => {
    useResource.mockImplementation(
      createResourceMock([
        { when: "/api/stats", value: () => failure("Stats endpoint unavailable") },
        { when: "/api/insights/bridges", value: () => success([]) },
        { when: (path) => path.startsWith("/api/search"), value: () => success([]) }
      ])
    );

    render(<DashboardPage />);

    expect(screen.getByText("Stats endpoint unavailable")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
