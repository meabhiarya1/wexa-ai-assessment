import { Router } from "express";
import { getBridgePeople } from "../controllers/insightsController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/bridges", asyncHandler(getBridgePeople));

export default router;
