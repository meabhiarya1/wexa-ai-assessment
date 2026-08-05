import { useEffect, useState } from "react";
import { normalizeRoute } from "./routes.jsx";

export function useBrowserRoute() {
  const [route, setRoute] = useState(() => normalizeRoute(window.location.pathname));

  useEffect(() => {
    if (window.location.pathname !== route) {
      window.history.replaceState(null, "", route);
    }

    const handlePopState = () => setRoute(normalizeRoute(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [route]);

  const navigate = (path) => {
    const nextRoute = normalizeRoute(path);
    window.history.pushState(null, "", nextRoute);
    setRoute(nextRoute);
  };

  return [route, navigate];
}
