import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PeoplePage } from "./PeoplePage.jsx";
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

describe("PeoplePage", () => {
  beforeEach(() => {
    useAppData.mockReturnValue(appData);
  });

  it("lists people, opens a profile, shows collaborators, and paginates", async () => {
    const user = userEvent.setup();
    useResource.mockImplementation(
      createResourceMock([
        {
          when: (path) => path.startsWith("/api/people?"),
          value: () =>
            success(
              paginated(people, {
                total: 16,
                totalPages: 2,
                hasNextPage: true
              })
            )
        },
        {
          when: "/api/people/person-aanya",
          value: () =>
            success({
              person: { ...people[0], bio: "Builds reliable graph services." },
              skills: [{ ...skills[0], level: 5 }],
              projects: [{ ...projects[0], role: "Tech Lead" }]
            })
        },
        {
          when: "/api/people/person-aanya/collaborators",
          value: () => success([{ ...people[1], strength: 2 }])
        }
      ])
    );

    render(<PeoplePage />);

    expect(screen.getByRole("heading", { name: "People" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /aanya mehta/i }));

    expect(screen.getByText("React L5")).toBeInTheDocument();
    expect(screen.getByText(/atlas graph explorer/i)).toBeInTheDocument();
    expect(screen.getByText("2 shared project(s)")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() =>
      expect(useResource).toHaveBeenCalledWith(expect.stringContaining("page=2"), expect.any(Array))
    );
  });

  it("renders list and profile failure states", async () => {
    const user = userEvent.setup();
    useResource.mockImplementation(
      createResourceMock([
        { when: (path) => path.startsWith("/api/people?"), value: () => success(paginated([people[0]])) },
        { when: "/api/people/person-aanya", value: () => failure("Profile lookup failed") },
        { when: "/api/people/person-aanya/collaborators", value: () => success([]) }
      ])
    );

    render(<PeoplePage />);
    await user.click(screen.getByRole("button", { name: /aanya mehta/i }));

    expect(screen.getByText("Profile lookup failed")).toBeInTheDocument();
  });

  it("shows empty and list error states", () => {
    useResource.mockImplementation(
      createResourceMock([{ when: (path) => path.startsWith("/api/people?"), value: () => failure("People API down") }])
    );

    render(<PeoplePage />);

    expect(screen.getByText("People API down")).toBeInTheDocument();
  });
});
