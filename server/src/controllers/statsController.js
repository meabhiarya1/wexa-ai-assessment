import { getStats } from "../services/statsService.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function getStatsSummary(_req, res) {
  sendSuccess(res, await getStats(), "Stats fetched successfully.");
}
