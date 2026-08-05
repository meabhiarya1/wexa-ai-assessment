import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { fetchJson } from "../api.js";
import { useResource } from "./useResource.js";

vi.mock("../api.js", () => ({
  fetchJson: vi.fn()
}));

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
}

function Probe({ path }) {
  const resource = useResource(path, [path]);

  if (resource.loading) return <span>Loading</span>;
  if (resource.error) return <span>{resource.error.message}</span>;
  if (!resource.data) return <span>Empty</span>;

  return <span>{resource.data.label}</span>;
}

describe("useResource", () => {
  it("loads successful data", async () => {
    fetchJson.mockResolvedValueOnce({ label: "Loaded data" });

    render(<Probe path="/api/stats" />);

    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(await screen.findByText("Loaded data")).toBeInTheDocument();
  });

  it("surfaces request failures", async () => {
    fetchJson.mockRejectedValueOnce(new Error("Backend failed"));

    render(<Probe path="/api/stats" />);

    expect(await screen.findByText("Backend failed")).toBeInTheDocument();
  });

  it("does not request when path is null", () => {
    render(<Probe path={null} />);

    expect(screen.getByText("Empty")).toBeInTheDocument();
    expect(fetchJson).not.toHaveBeenCalled();
  });

  it("ignores stale responses after path changes", async () => {
    const first = deferred();
    const second = deferred();
    fetchJson.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);

    const { rerender } = render(<Probe path="/api/first" />);
    rerender(<Probe path="/api/second" />);

    second.resolve({ label: "Second response" });
    first.resolve({ label: "First response" });

    expect(await screen.findByText("Second response")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("First response")).not.toBeInTheDocument());
  });
});
