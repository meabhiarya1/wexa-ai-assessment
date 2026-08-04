import { nodeProps, runRead } from "../db/neo4j.js";

function toPerson(node) {
  return nodeProps(node);
}

function toTeam(node) {
  return nodeProps(node);
}

function toSkill(node) {
  return nodeProps(node);
}

function toProject(node) {
  return nodeProps(node);
}

function graphNode(node) {
  const props = nodeProps(node);
  const type = node.labels[0];

  return {
    id: props.id,
    type,
    label: props.name,
    sublabel: props.title || props.category || props.status || props.focus || ""
  };
}

function relationshipLink(relationship, startNode, endNode) {
  const traversedForward = relationship.startNodeElementId === startNode.elementId;
  const source = traversedForward ? startNode : endNode;
  const target = traversedForward ? endNode : startNode;

  return {
    source: source.properties.id,
    target: target.properties.id,
    type: relationship.type
  };
}

function addUnique(map, node) {
  const normalized = graphNode(node);
  map.set(normalized.id, normalized);
}

function uniqueBy(items, getKey) {
  const seen = new Set();
  const unique = [];

  for (const item of items) {
    const key = getKey(item);
    if (seen.has(key)) continue;

    seen.add(key);
    unique.push(item);
  }

  return unique;
}

export async function getStats() {
  const [[people], [teams], [skills], [projects], [relationships]] = await Promise.all([
    runRead("MATCH (p:Person) RETURN count(p) AS count"),
    runRead("MATCH (t:Team) RETURN count(t) AS count"),
    runRead("MATCH (s:Skill) RETURN count(s) AS count"),
    runRead("MATCH (p:Project) RETURN count(p) AS count"),
    runRead("MATCH ()-[r]->() RETURN count(r) AS count")
  ]);

  return {
    people: people.count,
    teams: teams.count,
    skills: skills.count,
    projects: projects.count,
    relationships: relationships.count
  };
}

export async function listTeams() {
  const rows = await runRead("MATCH (t:Team) RETURN t ORDER BY t.name");
  return rows.map((row) => toTeam(row.t));
}

export async function listSkills() {
  const rows = await runRead("MATCH (s:Skill) RETURN s ORDER BY s.category, s.name");
  return rows.map((row) => toSkill(row.s));
}

export async function searchAll(term) {
  const rows = await runRead(
    `
    MATCH (p:Person)
    WHERE toLower(p.name) CONTAINS toLower($term) OR toLower(p.title) CONTAINS toLower($term)
    RETURN p.id AS id, p.name AS label, p.title AS sublabel, 'Person' AS type
    LIMIT 6
    UNION
    MATCH (pr:Project)
    WHERE toLower(pr.name) CONTAINS toLower($term)
    RETURN pr.id AS id, pr.name AS label, pr.status AS sublabel, 'Project' AS type
    LIMIT 6
    UNION
    MATCH (s:Skill)
    WHERE toLower(s.name) CONTAINS toLower($term) OR toLower(s.category) CONTAINS toLower($term)
    RETURN s.id AS id, s.name AS label, s.category AS sublabel, 'Skill' AS type
    LIMIT 6
    `,
    { term }
  );

  return rows;
}

export async function listPeople({ search = null, teamId = null, skillId = null } = {}) {
  const rows = await runRead(
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

  return rows.map((row) => ({
    ...toPerson(row.p),
    team: row.t ? toTeam(row.t) : null
  }));
}

export async function getPersonProfile(id) {
  const rows = await runRead(
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

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  return {
    person: {
      ...toPerson(row.p),
      team: row.t ? toTeam(row.t) : null
    },
    skills: uniqueBy(
      row.skillRows.filter((item) => item.skill).map((item) => ({ ...toSkill(item.skill), level: item.level, years: item.years })),
      (skill) => skill.id
    ).sort((a, b) => b.level - a.level || a.name.localeCompare(b.name)),
    projects: uniqueBy(
      row.projectRows
        .filter((item) => item.project)
        .map((item) => ({ ...toProject(item.project), role: item.role, since: item.since })),
      (project) => `${project.id}:${project.role}:${project.since}`
    ).sort((a, b) => a.name.localeCompare(b.name)),
    mentors: uniqueBy(row.mentors.filter(Boolean).map(toPerson), (person) => person.id),
    mentees: uniqueBy(row.mentees.filter(Boolean).map(toPerson), (person) => person.id)
  };
}

export async function getCollaborators(id) {
  const rows = await runRead(
    `
    MATCH (me:Person {id: $id})-[:WORKS_ON]->(project:Project)<-[:WORKS_ON]-(collaborator:Person)
    WHERE collaborator.id <> $id
    RETURN collaborator, collect(DISTINCT project.name) AS sharedProjects, count(DISTINCT project) AS strength
    ORDER BY strength DESC, collaborator.name
    LIMIT 12
    `,
    { id }
  );

  return rows.map((row) => ({
    ...toPerson(row.collaborator),
    sharedProjects: row.sharedProjects,
    strength: row.strength
  }));
}

export async function listProjects({ search = null, teamId = null, status = null } = {}) {
  const rows = await runRead(
    `
    MATCH (pr:Project)
    OPTIONAL MATCH (pr)-[:OWNED_BY]->(t:Team)
    WITH pr, t
    WHERE ($search IS NULL OR toLower(pr.name) CONTAINS toLower($search))
      AND ($teamId IS NULL OR t.id = $teamId)
      AND ($status IS NULL OR pr.status = $status)
    RETURN pr, t
    ORDER BY pr.name
    `,
    { search, teamId, status }
  );

  return rows.map((row) => ({
    ...toProject(row.pr),
    team: row.t ? toTeam(row.t) : null
  }));
}

export async function getProjectDetail(id) {
  const rows = await runRead(
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

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  return {
    project: {
      ...toProject(row.pr),
      team: row.t ? toTeam(row.t) : null
    },
    requiredSkills: uniqueBy(
      row.requiredSkillRows.filter((item) => item.skill).map((item) => ({ ...toSkill(item.skill), priority: item.priority })),
      (skill) => skill.id
    ).sort((a, b) => a.priority.localeCompare(b.priority) || a.name.localeCompare(b.name)),
    members: uniqueBy(
      row.memberRows.filter((item) => item.person).map((item) => ({ ...toPerson(item.person), role: item.role, since: item.since })),
      (person) => `${person.id}:${person.role}:${person.since}`
    ).sort((a, b) => a.name.localeCompare(b.name))
  };
}

export async function getProjectSkillGaps(id) {
  const rows = await runRead(
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

  return rows.map((row) => ({
    skill: toSkill(row.s),
    priority: row.priority,
    candidates: row.candidates.filter(Boolean).sort((a, b) => b.fitScore - a.fitScore)
  }));
}

export async function findBridgePeople(limit = 10) {
  const rows = await runRead(
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

  return rows.map((row) => ({
    ...toPerson(row.person),
    homeTeam: toTeam(row.homeTeam),
    connectedTeam: toTeam(row.peerTeam),
    bridgeStrength: row.bridgeStrength,
    projects: row.projects
  }));
}

export async function findShortestPath(fromId, toId) {
  const rows = await runRead(
    `
    MATCH (from:Person {id: $fromId}), (to:Person {id: $toId})
    MATCH path = shortestPath((from)-[:WORKS_ON|MEMBER_OF|MENTORS*..8]-(to))
    RETURN path
    `,
    { fromId, toId }
  );

  if (rows.length === 0) {
    return null;
  }

  const path = rows[0].path;
  const nodes = new Map();
  const links = [];

  addUnique(nodes, path.start);
  for (const segment of path.segments) {
    addUnique(nodes, segment.start);
    addUnique(nodes, segment.end);
    links.push(relationshipLink(segment.relationship, segment.start, segment.end));
  }

  return {
    nodes: [...nodes.values()],
    links
  };
}

export async function getNetworkGraph({ teamId = null } = {}) {
  const rows = await runRead(
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

  const nodes = new Map();
  const links = [];

  for (const row of rows) {
    addUnique(nodes, row.p);

    if (row.t) {
      addUnique(nodes, row.t);
      links.push({ source: row.p.properties.id, target: row.t.properties.id, type: "MEMBER_OF" });
    }

    for (const project of row.projects.filter(Boolean)) {
      addUnique(nodes, project);
      links.push({ source: row.p.properties.id, target: project.properties.id, type: "WORKS_ON" });
    }

    for (const mentee of row.mentees.filter(Boolean)) {
      addUnique(nodes, mentee);
      links.push({ source: row.p.properties.id, target: mentee.properties.id, type: "MENTORS" });
    }
  }

  return {
    nodes: [...nodes.values()],
    links
  };
}
