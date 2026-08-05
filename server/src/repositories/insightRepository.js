import { runRead } from "../db/neo4j.js";

export function fetchBridgePeople(limit = 10) {
  return runRead(
    `
    MATCH (person:Person)-[:MEMBER_OF]->(homeTeam:Team)
    MATCH (person)-[:WORKS_ON]->(project:Project)<-[:WORKS_ON]-(peer:Person)-[:MEMBER_OF]->(peerTeam:Team)
    WHERE homeTeam.id <> peerTeam.id
    RETURN person, homeTeam, peerTeam, count(DISTINCT project) AS bridgeStrength,
      collect(DISTINCT project.name)[0..4] AS projects
    ORDER BY bridgeStrength DESC, person.name
    LIMIT $limit
    `,
    { limit }
  );
}
