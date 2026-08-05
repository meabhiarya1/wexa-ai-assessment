import { runRead } from "../db/neo4j.js";

export function fetchPeople({ search = null, teamId = null, skillId = null } = {}) {
  return runRead(
    `
    MATCH (p:Person)
    OPTIONAL MATCH (p)-[:MEMBER_OF]->(t:Team)
    WITH p, t
    WHERE ($search IS NULL OR toLower(p.name) CONTAINS toLower($search) OR toLower(p.title) CONTAINS toLower($search))
      AND ($teamId IS NULL OR t.id = $teamId)
      AND ($skillId IS NULL OR (p)-[:HAS_SKILL]->(:Skill {id: $skillId}))
    RETURN p, t
    ORDER BY p.name
    `,
    { search, teamId, skillId }
  );
}

export function fetchPersonProfile(id) {
  return runRead(
    `
    MATCH (p:Person {id: $id})
    OPTIONAL MATCH (p)-[:MEMBER_OF]->(t:Team)
    OPTIONAL MATCH (p)-[hs:HAS_SKILL]->(s:Skill)
    OPTIONAL MATCH (p)-[w:WORKS_ON]->(pr:Project)
    OPTIONAL MATCH (mentor:Person)-[:MENTORS]->(p)
    OPTIONAL MATCH (p)-[:MENTORS]->(mentee:Person)
    RETURN p, t,
      collect(DISTINCT {skill: s, level: hs.level, years: hs.years}) AS skillRows,
      collect(DISTINCT {project: pr, role: w.role, since: w.since}) AS projectRows,
      collect(DISTINCT mentor) AS mentors,
      collect(DISTINCT mentee) AS mentees
    `,
    { id }
  );
}

export function fetchCollaborators(id) {
  return runRead(
    `
    MATCH (me:Person {id: $id})-[:WORKS_ON]->(project:Project)<-[:WORKS_ON]-(collaborator:Person)
    WHERE collaborator.id <> $id
    RETURN collaborator, collect(DISTINCT project.name) AS sharedProjects, count(DISTINCT project) AS strength
    ORDER BY strength DESC, collaborator.name
    LIMIT 12
    `,
    { id }
  );
}
