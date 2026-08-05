import { useEffect, useState } from "react";
import { fetchJson } from "../api.js";

export function useResource(path, deps = []) {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    const controller = new AbortController();

    if (!path) {
      setState({ loading: false, data: null, error: null });
      return () => controller.abort();
    }

    setState({ loading: true, data: null, error: null });

    fetchJson(path, { signal: controller.signal })
      .then((data) => setState({ loading: false, data, error: null }))
      .catch((error) => {
        if (error.name !== "CanceledError" && error.name !== "AbortError") {
          setState({ loading: false, data: null, error });
        }
      });

    return () => controller.abort();
  }, deps);

  const retry = () => {
    if (!path) return;

    setState({ loading: true, data: null, error: null });
    fetchJson(path)
      .then((data) => setState({ loading: false, data, error: null }))
      .catch((error) => setState({ loading: false, data: null, error }));
  };

  return { ...state, retry };
}
