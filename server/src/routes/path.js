import { Router } from "express";
import { getShortestPath } from "../controllers/pathController.js";
import { validatePathQuery } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", validatePathQuery, asyncHandler(getShortestPath));

export default router;
