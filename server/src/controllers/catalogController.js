import { listSkills, listTeams } from "../services/catalogService.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function getTeams(_req, res) {
  sendSuccess(res, await listTeams(), "Teams fetched successfully.");
}

export async function getSkills(_req, res) {
  sendSuccess(res, await listSkills(), "Skills fetched successfully.");
}
