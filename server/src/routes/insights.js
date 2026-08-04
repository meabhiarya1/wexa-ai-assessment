import { Router } from "express";
import { findBridgePeople } from "../services/graphService.js";

const router = Router();

router.get("/bridges", async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 10);
    res.json(await findBridgePeople(limit));
  } catch (error) {
    next(error);
  }
});

export default router;
