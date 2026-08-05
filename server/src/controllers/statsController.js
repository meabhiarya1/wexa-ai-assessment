import { getStats } from "../services/statsService.js";

export async function getStatsSummary(_req, res) {
  res.json(await getStats());
}
