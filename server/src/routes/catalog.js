import { Router } from "express";
import { getSkills, getTeams } from "../controllers/catalogController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/teams", asyncHandler(getTeams));
router.get("/skills", asyncHandler(getSkills));

export default router;
