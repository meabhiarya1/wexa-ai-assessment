import { toPerson, toProject, toSkill, toTeam } from "../mappers/graphMapper.js";
import { fetchCollaborators, fetchPeople, fetchPersonProfile } from "../repositories/peopleRepository.js";
import { uniqueBy } from "../utils/collections.js";
import { buildPagination } from "../utils/pagination.js";

export async function listPeople({ search = null, teamId = null, skillId = null, page = 1, limit = 8, skip = 0 } = {}) {
  const { rows, total } = await fetchPeople({ search, teamId, skillId, skip, limit });

  return {
    items: rows.map((row) => ({
      ...toPerson(row.p),
      team: row.t ? toTeam(row.t) : null
    })),
    pagination: buildPagination({ page, limit, total })
  };
}

export async function getPersonProfile(id) {
  const rows = await fetchPersonProfile(id);

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
      (row.skillRows || []).filter((item) => item.skill).map((item) => ({ ...toSkill(item.skill), level: item.level, years: item.years })),
      (skill) => skill.id
    ).sort((a, b) => b.level - a.level || a.name.localeCompare(b.name)),
    projects: uniqueBy(
      (row.projectRows || [])
        .filter((item) => item.project)
        .map((item) => ({ ...toProject(item.project), role: item.role, since: item.since })),
      (project) => `${project.id}:${project.role}:${project.since}`
    ).sort((a, b) => a.name.localeCompare(b.name)),
    mentors: uniqueBy((row.mentors || []).filter(Boolean).map(toPerson), (person) => person.id),
    mentees: uniqueBy((row.mentees || []).filter(Boolean).map(toPerson), (person) => person.id)
  };
}

export async function getCollaborators(id) {
  const rows = await fetchCollaborators(id);

  return rows.map((row) => ({
    ...toPerson(row.collaborator),
    sharedProjects: row.sharedProjects,
    strength: row.strength
  }));
}
