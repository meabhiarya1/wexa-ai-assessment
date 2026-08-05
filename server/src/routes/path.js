import { Router } from "express";
import { getShortestPath } from "../controllers/pathController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getShortestPath));

export default router;
