import { getNetworkGraph } from "../services/networkService.js";
import { optionalString } from "../utils/requestParams.js";

export async function getGraph(req, res) {
  res.json(await getNetworkGraph({ teamId: optionalString(req.query.teamId) }));
}
