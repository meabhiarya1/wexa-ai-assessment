import { runRead } from "../db/neo4j.js";

export function fetchTeams() {
  return runRead("MATCH (t:Team) RETURN t ORDER BY t.name");
}

export function fetchSkills() {
  return runRead("MATCH (s:Skill) RETURN s ORDER BY s.category, s.name");
}
