import { Router } from "express";
import { listSkills, listTeams } from "../services/graphService.js";

const router = Router();

router.get("/teams", async (_req, res, next) => {
  try {
    res.json(await listTeams());
  } catch (error) {
    next(error);
  }
});

router.get("/skills", async (_req, res, next) => {
  try {
    res.json(await listSkills());
  } catch (error) {
    next(error);
  }
});

export default router;
