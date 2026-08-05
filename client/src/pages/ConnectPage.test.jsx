import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConnectPage } from "./ConnectPage.jsx";
import { useResource } from "../hooks/useResource.js";
import { failure, graph, paginated, people, success } from "../test/fixtures.js";
import { createResourceMock } from "../test/mockResource.js";

vi.mock("../hooks/useResource.js", () => ({
  useResource: vi.fn()
}));

describe("ConnectPage", () => {
  it("finds and displays a shortest path between two people", async () => {
    const user = userEvent.setup();
    useResource.mockImplementation(
      createResourceMock([
        { when: (path) => path.startsWith("/api/people?"), value: () => success(paginated(people)) },
        { when: (path) => path.startsWith("/api/path?"), value: () => success({ found: true, graph }) }
      ])
    );

    render(<ConnectPage />);

    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[0], "person-aanya");
    await user.selectOptions(selects[1], "person-ben");

    expect(screen.getByText("Drag nodes")).toBeInTheDocument();
    expect(screen.getByText("2 relationships")).toBeInTheDocument();
    expect(screen.getByText("works on")).toBeInTheDocument();
    expect(screen.getByText("Cypher powering shortest path")).toBeInTheDocument();
  });

  it("shows no-path and API error states", async () => {
    const user = userEvent.setup();
    useResource.mockImplementation(
      createResourceMock([
        { when: (path) => path.startsWith("/api/people?"), value: () => success(paginated(people)) },
        { when: (path) => path.startsWith("/api/path?"), value: () => success({ found: false }) }
      ])
    );

    render(<ConnectPage />);
    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[0], "person-aanya");
    await user.selectOptions(selects[1], "person-ben");

    expect(screen.getByText("No path found")).toBeInTheDocument();

    useResource.mockImplementation(
      createResourceMock([
        { when: (path) => path.startsWith("/api/people?"), value: () => failure("Directory unavailable") }
      ])
    );

    render(<ConnectPage />);
    expect(screen.getByText("Directory unavailable")).toBeInTheDocument();
  });
});
