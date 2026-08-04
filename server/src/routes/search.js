import { Router } from "express";
import { searchAll } from "../services/graphService.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const term = String(req.query.q || "").trim();
    if (term.length < 2) {
      return res.json([]);
    }

    return res.json(await searchAll(term));
  } catch (error) {
    return next(error);
  }
});

export default router;
