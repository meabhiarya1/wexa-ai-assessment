import { runRead } from "../db/neo4j.js";

export async function fetchProjects({ search = null, teamId = null, status = null, skip = 0, limit = 8 } = {}) {
  const [rows, [countRow]] = await Promise.all([
    runRead(
    `
    MATCH (pr:Project)
    OPTIONAL MATCH (pr)-[:OWNED_BY]->(t:Team)
    WITH pr, t
    WHERE ($search IS NULL OR toLower(pr.name) CONTAINS toLower($search))
      AND ($teamId IS NULL OR t.id = $teamId)
      AND ($status IS NULL OR pr.status = $status)
    RETURN pr, t
    ORDER BY pr.name
    SKIP $skip
    LIMIT $limit
    `,
      { search, teamId, status, skip, limit }
    ),
    runRead(
      `
      MATCH (pr:Project)
      OPTIONAL MATCH (pr)-[:OWNED_BY]->(t:Team)
      WITH pr, t
      WHERE ($search IS NULL OR toLower(pr.name) CONTAINS toLower($search))
        AND ($teamId IS NULL OR t.id = $teamId)
        AND ($status IS NULL OR pr.status = $status)
      RETURN count(DISTINCT pr) AS total
      `,
      { search, teamId, status }
    )
  ]);

  return { rows, total: countRow?.total || 0 };
}

export function fetchProjectDetail(id) {
  return runRead(
    `
    MATCH (pr:Project {id: $id})
    OPTIONAL MATCH (pr)-[:OWNED_BY]->(t:Team)
    OPTIONAL MATCH (pr)-[req:REQUIRES_SKILL]->(s:Skill)
    OPTIONAL MATCH (pr)<-[w:WORKS_ON]-(member:Person)
    RETURN pr, t,
      collect(DISTINCT {skill: s, priority: req.priority}) AS requiredSkillRows,
      collect(DISTINCT {person: member, role: w.role, since: w.since}) AS memberRows
    `,
    { id }
  );
}

export function fetchProjectSkillGaps(id) {
  return runRead(
    `
    MATCH (pr:Project {id: $id})-[req:REQUIRES_SKILL]->(s:Skill)
    OPTIONAL MATCH (pr)<-[:WORKS_ON]-(coveringPerson:Person)-[:HAS_SKILL]->(s)
    WITH pr, s, req.priority AS priority, count(coveringPerson) AS coveredCount
    WHERE coveredCount = 0
    OPTIONAL MATCH (candidate:Person)-[hs:HAS_SKILL]->(s)
    WHERE NOT (candidate)-[:WORKS_ON]->(pr)
    OPTIONAL MATCH (candidate)-[:MEMBER_OF]->(candidateTeam:Team)
    OPTIONAL MATCH (pr)-[:OWNED_BY]->(projectTeam:Team)
    WITH s, priority, candidate, hs, candidateTeam, projectTeam,
      CASE WHEN candidateTeam.id = projectTeam.id THEN 10 ELSE 0 END AS sameTeamBonus
    ORDER BY hs.level DESC, hs.years DESC
    WITH s, priority, collect(CASE WHEN candidate IS NOT NULL THEN {
      id: candidate.id,
      name: candidate.name,
      title: candidate.title,
      email: candidate.email,
      bio: candidate.bio,
      team: candidateTeam.name,
      level: hs.level,
      years: hs.years,
      fitScore: (hs.level * 18) + (hs.years * 2) + sameTeamBonus
    } END) AS candidates
    RETURN s, priority, candidates[0..5] AS candidates
    ORDER BY priority, s.name
    `,
    { id }
  );
}
