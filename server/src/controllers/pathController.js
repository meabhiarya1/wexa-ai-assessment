import { findShortestPath } from "../services/pathService.js";
import { optionalString } from "../utils/requestParams.js";
import { badRequest } from "../utils/httpErrors.js";

export async function getShortestPath(req, res) {
  const from = optionalString(req.query.from);
  const to = optionalString(req.query.to);

  if (!from || !to) {
    throw badRequest("Both 'from' and 'to' person ids are required.");
  }

  const graph = await findShortestPath(from, to);

  if (!graph) {
    return res.json({ found: false });
  }

  return res.json({ found: true, graph });
}
