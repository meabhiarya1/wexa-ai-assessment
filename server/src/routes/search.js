import { Router } from "express";
import { searchGraph } from "../controllers/searchController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(searchGraph));

export default router;
