import { Router } from "express";
import { getStatsSummary } from "../controllers/statsController.js";
import { cacheResponse } from "../middleware/cache.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", cacheResponse(30 * 1000), asyncHandler(getStatsSummary));

export default router;
