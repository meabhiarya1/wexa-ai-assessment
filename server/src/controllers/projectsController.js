import { getProjectDetail, getProjectSkillGaps, listProjects } from "../services/projectService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";
import { optionalString } from "../utils/requestParams.js";
import { notFound } from "../utils/httpErrors.js";

export async function getProjects(req, res) {
  const pagination = getPaginationParams(req.query);

  sendSuccess(
    res,
    await listProjects({
      search: optionalString(req.query.search),
      teamId: optionalString(req.query.teamId),
      status: optionalString(req.query.status),
      ...pagination
    }),
    "Projects fetched successfully."
  );
}

export async function getProject(req, res) {
  const project = await getProjectDetail(req.params.id);

  if (!project) {
    throw notFound("Project not found");
  }

  return sendSuccess(res, project, "Project detail fetched successfully.");
}

export async function getSkillGaps(req, res) {
  sendSuccess(res, await getProjectSkillGaps(req.params.id), "Project skill gaps fetched successfully.");
}
