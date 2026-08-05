import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExplorePage } from "./ExplorePage.jsx";
import { useAppData } from "../context/AppDataContext.jsx";
import { useResource } from "../hooks/useResource.js";
import { appData, failure, graph, success } from "../test/fixtures.js";
import { createResourceMock } from "../test/mockResource.js";

vi.mock("../context/AppDataContext.jsx", () => ({
  useAppData: vi.fn()
}));

vi.mock("../hooks/useResource.js", () => ({
  useResource: vi.fn()
}));

describe("ExplorePage", () => {
  beforeEach(() => {
    useAppData.mockReturnValue(appData);
  });

  it("renders graph metrics and filters by team", async () => {
    const user = userEvent.setup();
    useResource.mockImplementation(createResourceMock([{ when: (path) => path.startsWith("/api/graph"), value: () => success(graph) }]));

    render(<ExplorePage />);

    expect(screen.getByText("Drag nodes")).toBeInTheDocument();
    expect(screen.getAllByText(/relationships/i).length).toBeGreaterThan(0);
    expect(screen.getByText("relationships")).toBeInTheDocument();

    await user.selectOptions(screen.getByDisplayValue("Whole organization"), "team-platform");
    await waitFor(() =>
      expect(useResource).toHaveBeenCalledWith("/api/graph?teamId=team-platform", ["team-platform"])
    );
  });

  it("shows graph API errors and empty graph data states", () => {
    useResource.mockImplementation(createResourceMock([{ when: (path) => path.startsWith("/api/graph"), value: () => failure("Graph API down") }]));
    render(<ExplorePage />);
    expect(screen.getByText("Graph API down")).toBeInTheDocument();

    useResource.mockImplementation(createResourceMock([{ when: (path) => path.startsWith("/api/graph"), value: () => success({ nodes: [], links: [] }) }]));
    render(<ExplorePage />);
    expect(screen.getByText("No graph data")).toBeInTheDocument();
  });
});
