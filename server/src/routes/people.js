import { Router } from "express";
import { getPeople, getPerson, getPersonCollaborators } from "../controllers/peopleController.js";
import { validatePeopleQuery, validatePersonParam } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", validatePeopleQuery, asyncHandler(getPeople));
router.get("/:id", validatePersonParam, asyncHandler(getPerson));
router.get("/:id/collaborators", validatePersonParam, asyncHandler(getPersonCollaborators));

export default router;
