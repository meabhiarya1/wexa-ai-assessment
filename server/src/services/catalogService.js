import { fetchSkills, fetchTeams } from "../repositories/catalogRepository.js";
import { toSkill, toTeam } from "../mappers/graphMapper.js";

export async function listTeams() {
  const rows = await fetchTeams();
  return rows.map((row) => toTeam(row.t));
}

export async function listSkills() {
  const rows = await fetchSkills();
  return rows.map((row) => toSkill(row.s));
}
