import { Router } from "express";
import { getPeople, getPerson, getPersonCollaborators } from "../controllers/peopleController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getPeople));
router.get("/:id", asyncHandler(getPerson));
router.get("/:id/collaborators", asyncHandler(getPersonCollaborators));

export default router;
