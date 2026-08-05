import { toPerson, toProject, toSkill, toTeam } from "../mappers/graphMapper.js";
import { fetchProjectDetail, fetchProjects, fetchProjectSkillGaps } from "../repositories/projectRepository.js";
import { uniqueBy } from "../utils/collections.js";
import { buildPagination } from "../utils/pagination.js";

export async function listProjects({ search = null, teamId = null, status = null, page = 1, limit = 8, skip = 0 } = {}) {
  const { rows, total } = await fetchProjects({ search, teamId, status, skip, limit });

  return {
    items: rows.map((row) => ({
      ...toProject(row.pr),
      team: row.t ? toTeam(row.t) : null
    })),
    pagination: buildPagination({ page, limit, total })
  };
}

export async function getProjectDetail(id) {
  const rows = await fetchProjectDetail(id);

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
      (row.requiredSkillRows || []).filter((item) => item.skill).map((item) => ({ ...toSkill(item.skill), priority: item.priority })),
      (skill) => skill.id
    ).sort((a, b) => a.priority.localeCompare(b.priority) || a.name.localeCompare(b.name)),
    members: uniqueBy(
      (row.memberRows || []).filter((item) => item.person).map((item) => ({ ...toPerson(item.person), role: item.role, since: item.since })),
      (person) => `${person.id}:${person.role}:${person.since}`
    ).sort((a, b) => a.name.localeCompare(b.name))
  };
}

export async function getProjectSkillGaps(id) {
  const rows = await fetchProjectSkillGaps(id);

  return rows.map((row) => ({
    skill: toSkill(row.s),
    priority: row.priority,
    candidates: (row.candidates || []).filter(Boolean).sort((a, b) => b.fitScore - a.fitScore)
  }));
}
