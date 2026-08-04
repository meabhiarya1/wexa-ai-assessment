import { Router } from "express";
import { getStats } from "../services/graphService.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await getStats());
  } catch (error) {
    next(error);
  }
});

export default router;
