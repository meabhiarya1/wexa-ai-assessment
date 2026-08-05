import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DbBanner, ErrorState, GraphView, PaginationControls } from "./components.jsx";
import { ApiError } from "./api.js";

describe("shared UI components", () => {
  it("renders database health states", () => {
    const { rerender } = render(<DbBanner loading />);
    expect(screen.getByText(/checking cognodb/i)).toBeInTheDocument();

    rerender(<DbBanner health={{ ok: true }} />);
    expect(screen.getByText("Connected to CognoDB")).toBeInTheDocument();

    rerender(<DbBanner error={new Error("CognoDB refused connection")} />);
    expect(screen.getByText("CognoDB refused connection")).toBeInTheDocument();
  });

  it("shows structured API error details", () => {
    render(<ErrorState error={new ApiError("Configuration missing", 503, { missingVars: ["COGNODB_URI"] })} />);

    expect(screen.getByText("Configuration missing")).toBeInTheDocument();
    expect(screen.getByText("Missing: COGNODB_URI")).toBeInTheDocument();
  });

  it("handles pagination controls", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <PaginationControls
        pagination={{ page: 2, totalPages: 3, total: 21, hasNextPage: true, hasPreviousPage: true }}
        onPageChange={onPageChange}
      />
    );

    await user.click(screen.getByRole("button", { name: /previous/i }));
    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  it("shows an empty graph state before drawing", () => {
    render(<GraphView graph={{ nodes: [], links: [] }} />);

    expect(screen.getByText("No graph data")).toBeInTheDocument();
  });
});
