import { Router } from "express";
import { getSkills, getTeams } from "../controllers/catalogController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cacheResponse } from "../middleware/cache.js";

const router = Router();

router.get("/teams", cacheResponse(5 * 60 * 1000), asyncHandler(getTeams));
router.get("/skills", cacheResponse(5 * 60 * 1000), asyncHandler(getSkills));

export default router;
