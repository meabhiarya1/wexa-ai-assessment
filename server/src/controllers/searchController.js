import { searchAll } from "../services/searchService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { optionalString } from "../utils/requestParams.js";

export async function searchGraph(req, res) {
  const term = optionalString(req.query.q);

  if (!term || term.length < 2) {
    return sendSuccess(res, [], "Search query is too short.");
  }

  return sendSuccess(res, await searchAll(term), "Search results fetched successfully.");
}
