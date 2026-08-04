import { Router } from "express";
import { getNetworkGraph } from "../services/graphService.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    res.json(await getNetworkGraph({ teamId: req.query.teamId || null }));
  } catch (error) {
    next(error);
  }
});

export default router;
