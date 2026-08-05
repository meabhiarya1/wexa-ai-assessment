import { Router } from "express";
import { getProject, getProjects, getSkillGaps } from "../controllers/projectsController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getProjects));
router.get("/:id", asyncHandler(getProject));
router.get("/:id/gaps", asyncHandler(getSkillGaps));

export default router;
