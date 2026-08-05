import { runRead } from "../db/neo4j.js";

export function fetchNetworkGraph({ teamId = null } = {}) {
  return runRead(
    `
    MATCH (p:Person)
    OPTIONAL MATCH (p)-[:MEMBER_OF]->(t:Team)
    WITH p, t
    WHERE $teamId IS NULL OR t.id = $teamId
    OPTIONAL MATCH (p)-[:WORKS_ON]->(pr:Project)
    OPTIONAL MATCH (p)-[:MENTORS]->(mentee:Person)
    RETURN p, t, collect(DISTINCT pr) AS projects, collect(DISTINCT mentee) AS mentees
    `,
    { teamId }
  );
}
