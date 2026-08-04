import { Router } from "express";
import { getCollaborators, getPersonProfile, listPeople } from "../services/graphService.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    res.json(
      await listPeople({
        search: req.query.search || null,
        teamId: req.query.teamId || null,
        skillId: req.query.skillId || null
      })
    );
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const profile = await getPersonProfile(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: "Person not found" });
    }

    return res.json(profile);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id/collaborators", async (req, res, next) => {
  try {
    res.json(await getCollaborators(req.params.id));
  } catch (error) {
    next(error);
  }
});

export default router;
