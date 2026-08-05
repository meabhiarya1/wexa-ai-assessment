import { findBridgePeople } from "../services/insightService.js";
import { positiveInteger } from "../utils/requestParams.js";

export async function getBridgePeople(req, res) {
  const limit = positiveInteger(req.query.limit, 10, { max: 25 });
  res.json(await findBridgePeople(limit));
}
