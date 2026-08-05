import { Router } from "express";
import { getBridgePeople } from "../controllers/insightsController.js";
import { cacheResponse } from "../middleware/cache.js";
import { validateBridgeQuery } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/bridges", validateBridgeQuery, cacheResponse(30 * 1000), asyncHandler(getBridgePeople));

export default router;
