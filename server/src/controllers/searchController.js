import { searchAll } from "../services/searchService.js";
import { optionalString } from "../utils/requestParams.js";

export async function searchGraph(req, res) {
  const term = optionalString(req.query.q);

  if (!term || term.length < 2) {
    return res.json([]);
  }

  return res.json(await searchAll(term));
}
