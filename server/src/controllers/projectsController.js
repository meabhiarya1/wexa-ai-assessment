import { getProjectDetail, getProjectSkillGaps, listProjects } from "../services/projectService.js";
import { optionalString } from "../utils/requestParams.js";
import { notFound } from "../utils/httpErrors.js";

export async function getProjects(req, res) {
  res.json(
    await listProjects({
      search: optionalString(req.query.search),
      teamId: optionalString(req.query.teamId),
      status: optionalString(req.query.status)
    })
  );
}

export async function getProject(req, res) {
  const project = await getProjectDetail(req.params.id);

  if (!project) {
    throw notFound("Project not found");
  }

  return res.json(project);
}

export async function getSkillGaps(req, res) {
  res.json(await getProjectSkillGaps(req.params.id));
}
