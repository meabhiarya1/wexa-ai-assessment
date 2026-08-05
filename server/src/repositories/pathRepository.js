import { runRead } from "../db/neo4j.js";

export function fetchShortestPath(fromId, toId) {
  return runRead(
    `
    MATCH (from:Person {id: $fromId}), (to:Person {id: $toId})
    MATCH path = shortestPath((from)-[:WORKS_ON|MEMBER_OF|MENTORS*..8]-(to))
    RETURN path
    `,
    { fromId, toId }
  );
}
