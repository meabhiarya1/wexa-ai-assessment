import { runRead } from "../db/neo4j.js";

export function fetchSearchResults(term) {
  return runRead(
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
}
