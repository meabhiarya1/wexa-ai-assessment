import { findShortestPath } from "../services/pathService.js";
import { sendSuccess } from "../utils/apiResponse.js";
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
    return sendSuccess(res, { found: false }, "No path found.");
  }

  return sendSuccess(res, { found: true, graph }, "Shortest path fetched successfully.");
}
