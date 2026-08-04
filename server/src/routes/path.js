import { Router } from "express";
import { findShortestPath } from "../services/graphService.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const from = req.query.from;
    const to = req.query.to;

    if (!from || !to) {
      return res.status(400).json({ error: "Both 'from' and 'to' person ids are required." });
    }

    const graph = await findShortestPath(from, to);
    if (!graph) {
      return res.json({ found: false });
    }

    return res.json({ found: true, graph });
  } catch (error) {
    return next(error);
  }
});

export default router;
