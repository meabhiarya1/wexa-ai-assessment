import { getCollaborators, getPersonProfile, listPeople } from "../services/peopleService.js";
import { optionalString } from "../utils/requestParams.js";

export async function getPeople(req, res) {
  res.json(
    await listPeople({
      search: optionalString(req.query.search),
      teamId: optionalString(req.query.teamId),
      skillId: optionalString(req.query.skillId)
    })
  );
}

export async function getPerson(req, res) {
  const profile = await getPersonProfile(req.params.id);

  if (!profile) {
    return res.status(404).json({ error: "Person not found" });
  }

  return res.json(profile);
}

export async function getPersonCollaborators(req, res) {
  res.json(await getCollaborators(req.params.id));
}
