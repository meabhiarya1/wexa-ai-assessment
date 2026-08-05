import { fetchStatsCounts } from "../repositories/statsRepository.js";

export async function getStats() {
  const { people, teams, skills, projects, relationships } = await fetchStatsCounts();

  return {
    people: people.count,
    teams: teams.count,
    skills: skills.count,
    projects: projects.count,
    relationships: relationships.count
  };
}
