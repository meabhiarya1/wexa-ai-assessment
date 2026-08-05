import { Router } from "express";
import { getDbHealth, getHealth, getLive } from "../controllers/healthController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getHealth));
router.get("/live", asyncHandler(getLive));
router.get("/db", asyncHandler(getDbHealth));

export default router;
