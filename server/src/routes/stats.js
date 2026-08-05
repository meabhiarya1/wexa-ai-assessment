import { Router } from "express";
import { getStatsSummary } from "../controllers/statsController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getStatsSummary));

export default router;
