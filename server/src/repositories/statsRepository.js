import { runRead } from "../db/neo4j.js";

export async function fetchStatsCounts() {
  const [[people], [teams], [skills], [projects], [relationships]] = await Promise.all([
    runRead("MATCH (p:Person) RETURN count(p) AS count"),
    runRead("MATCH (t:Team) RETURN count(t) AS count"),
    runRead("MATCH (s:Skill) RETURN count(s) AS count"),
    runRead("MATCH (p:Project) RETURN count(p) AS count"),
    runRead("MATCH ()-[r]->() RETURN count(r) AS count")
  ]);

  return { people, teams, skills, projects, relationships };
}
