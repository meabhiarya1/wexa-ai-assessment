import { findBridgePeople } from "../services/insightService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { positiveInteger } from "../utils/requestParams.js";

export async function getBridgePeople(req, res) {
  const limit = positiveInteger(req.query.limit, 10, { max: 25 });
  sendSuccess(res, await findBridgePeople(limit), "Bridge people fetched successfully.");
}
