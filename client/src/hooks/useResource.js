import { useEffect, useState } from "react";
import { fetchJson } from "../api.js";

export function useResource(path, deps = []) {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    let active = true;

    if (!path) {
      setState({ loading: false, data: null, error: null });
      return () => {
        active = false;
      };
    }

    setState({ loading: true, data: null, error: null });

    fetchJson(path)
      .then((data) => {
        if (active) {
          setState({ loading: false, data, error: null });
        }
      })
      .catch((error) => {
        if (active) {
          setState({ loading: false, data: null, error });
        }
      });

    return () => {
      active = false;
    };
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
