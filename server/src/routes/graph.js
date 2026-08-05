import { Router } from "express";
import { getGraph } from "../controllers/graphController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getGraph));

export default router;
