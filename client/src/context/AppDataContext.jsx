import { createContext, useContext } from "react";
import { useResource } from "../hooks/useResource.js";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const health = useResource("/api/health", []);
  const teams = useResource("/api/teams", []);
  const skills = useResource("/api/skills", []);

  return <AppDataContext.Provider value={{ health, teams, skills }}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider.");
  }

  return context;
}
