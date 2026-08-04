export const cypherSnippets = {
  bridgePeople: `MATCH (person:Person)-[:MEMBER_OF]->(homeTeam:Team)
MATCH (person)-[:WORKS_ON]->(project:Project)<-[:WORKS_ON]-(peer:Person)-[:MEMBER_OF]->(peerTeam:Team)
WHERE homeTeam.id <> peerTeam.id
RETURN person, homeTeam, peerTeam, count(DISTINCT project) AS bridgeStrength
ORDER BY bridgeStrength DESC`,

  skillGaps: `MATCH (pr:Project {id: $id})-[req:REQUIRES_SKILL]->(s:Skill)
OPTIONAL MATCH (pr)<-[:WORKS_ON]-(coveringPerson:Person)-[:HAS_SKILL]->(s)
WITH pr, s, req.priority AS priority, count(coveringPerson) AS coveredCount
WHERE coveredCount = 0
OPTIONAL MATCH (candidate:Person)-[hs:HAS_SKILL]->(s)
WHERE NOT (candidate)-[:WORKS_ON]->(pr)
RETURN s, priority, candidate, hs
ORDER BY hs.level DESC, hs.years DESC`,

  shortestPath: `MATCH (from:Person {id: $fromId}), (to:Person {id: $toId})
MATCH path = shortestPath((from)-[:WORKS_ON|MEMBER_OF|MENTORS*..8]-(to))
RETURN path`,

  network: `MATCH (p:Person)
OPTIONAL MATCH (p)-[:MEMBER_OF]->(t:Team)
OPTIONAL MATCH (p)-[:WORKS_ON]->(pr:Project)
OPTIONAL MATCH (p)-[:MENTORS]->(mentee:Person)
RETURN p, t, collect(DISTINCT pr) AS projects, collect(DISTINCT mentee) AS mentees`
};
