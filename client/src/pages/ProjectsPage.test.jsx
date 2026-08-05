import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectsPage } from "./ProjectsPage.jsx";
import { useAppData } from "../context/AppDataContext.jsx";
import { useResource } from "../hooks/useResource.js";
import { appData, failure, paginated, people, projects, skills, success } from "../test/fixtures.js";
import { createResourceMock } from "../test/mockResource.js";

vi.mock("../context/AppDataContext.jsx", () => ({
  useAppData: vi.fn()
}));

vi.mock("../hooks/useResource.js", () => ({
  useResource: vi.fn()
}));

describe("ProjectsPage", () => {
  beforeEach(() => {
    useAppData.mockReturnValue(appData);
  });

  it("opens project detail, shows members, gap candidates, and applies filters", async () => {
    const user = userEvent.setup();
    useResource.mockImplementation(
      createResourceMock([
        {
          when: (path) => path.startsWith("/api/projects?"),
          value: () => success(paginated(projects))
        },
        {
          when: "/api/projects/project-atlas",
          value: () =>
            success({
              project: projects[0],
              requiredSkills: [{ ...skills[0], priority: "must-have" }],
              members: [{ ...people[0], role: "Tech Lead" }]
            })
        },
        {
          when: "/api/projects/project-atlas/gaps",
          value: () =>
            success([
              {
                skill: skills[1],
                priority: "nice-to-have",
                candidates: [{ ...people[1], fitScore: 82, level: 4 }]
              }
            ])
        }
      ])
    );

    render(<ProjectsPage />);

    await user.click(screen.getByRole("button", { name: /atlas graph explorer/i }));

    expect(screen.getByText("Graph exploration for staffing decisions.")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Fit 82 / L4")).toBeInTheDocument();

    await user.selectOptions(screen.getByDisplayValue("Any status"), "active");
    await waitFor(() =>
      expect(useResource).toHaveBeenCalledWith(expect.stringContaining("status=active"), expect.any(Array))
    );
  });

  it("renders list and detail error states", async () => {
    const user = userEvent.setup();
    useResource.mockImplementation(
      createResourceMock([
        { when: (path) => path.startsWith("/api/projects?"), value: () => success(paginated([projects[0]])) },
        { when: "/api/projects/project-atlas", value: () => failure("Project detail failed") },
        { when: "/api/projects/project-atlas/gaps", value: () => success([]) }
      ])
    );

    render(<ProjectsPage />);
    await user.click(screen.getByRole("button", { name: /atlas graph explorer/i }));

    expect(screen.getByText("Project detail failed")).toBeInTheDocument();
  });

  it("shows project list failures", () => {
    useResource.mockImplementation(
      createResourceMock([{ when: (path) => path.startsWith("/api/projects?"), value: () => failure("Projects API down") }])
    );

    render(<ProjectsPage />);

    expect(screen.getByText("Projects API down")).toBeInTheDocument();
  });
});
