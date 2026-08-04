import { Router } from "express";
import { getProjectDetail, getProjectSkillGaps, listProjects } from "../services/graphService.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    res.json(
      await listProjects({
        search: req.query.search || null,
        teamId: req.query.teamId || null,
        status: req.query.status || null
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const project = await getProjectDetail(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.json(project);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id/gaps", async (req, res, next) => {
  try {
    res.json(await getProjectSkillGaps(req.params.id));
  } catch (error) {
    next(error);
  }
});

export default router;
