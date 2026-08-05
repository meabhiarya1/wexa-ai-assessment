import { listSkills, listTeams } from "../services/catalogService.js";

export async function getTeams(_req, res) {
  res.json(await listTeams());
}

export async function getSkills(_req, res) {
  res.json(await listSkills());
}
