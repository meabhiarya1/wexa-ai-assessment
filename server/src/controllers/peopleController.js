import { getCollaborators, getPersonProfile, listPeople } from "../services/peopleService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { getPaginationParams } from "../utils/pagination.js";
import { optionalString } from "../utils/requestParams.js";
import { notFound } from "../utils/httpErrors.js";

export async function getPeople(req, res) {
  const pagination = getPaginationParams(req.query);

  sendSuccess(
    res,
    await listPeople({
      search: optionalString(req.query.search),
      teamId: optionalString(req.query.teamId),
      skillId: optionalString(req.query.skillId),
      ...pagination
    }),
    "People fetched successfully."
  );
}

export async function getPerson(req, res) {
  const profile = await getPersonProfile(req.params.id);

  if (!profile) {
    throw notFound("Person not found");
  }

  return sendSuccess(res, profile, "Person profile fetched successfully.");
}

export async function getPersonCollaborators(req, res) {
  sendSuccess(res, await getCollaborators(req.params.id), "Collaborators fetched successfully.");
}
