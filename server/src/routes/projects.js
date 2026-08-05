import { Router } from "express";
import { getProject, getProjects, getSkillGaps } from "../controllers/projectsController.js";
import { validateProjectParam, validateProjectsQuery } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", validateProjectsQuery, asyncHandler(getProjects));
router.get("/:id", validateProjectParam, asyncHandler(getProject));
router.get("/:id/gaps", validateProjectParam, asyncHandler(getSkillGaps));

export default router;
