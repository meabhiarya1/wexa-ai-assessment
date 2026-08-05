import { getNetworkGraph } from "../services/networkService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { optionalString } from "../utils/requestParams.js";

export async function getGraph(req, res) {
  sendSuccess(res, await getNetworkGraph({ teamId: optionalString(req.query.teamId) }), "Graph fetched successfully.");
}
