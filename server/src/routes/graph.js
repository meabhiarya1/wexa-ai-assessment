import { Router } from "express";
import { getGraph } from "../controllers/graphController.js";
import { cacheResponse } from "../middleware/cache.js";
import { validateGraphQuery } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", validateGraphQuery, cacheResponse(15 * 1000), asyncHandler(getGraph));

export default router;
