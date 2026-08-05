import { Router } from "express";
import { searchGraph } from "../controllers/searchController.js";
import { validateSearchQuery } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", validateSearchQuery, asyncHandler(searchGraph));

export default router;
