import { toPerson, toTeam } from "../mappers/graphMapper.js";
import { fetchBridgePeople } from "../repositories/insightRepository.js";

export async function findBridgePeople(limit = 10) {
  const rows = await fetchBridgePeople(limit);

  return rows.map((row) => ({
    ...toPerson(row.person),
    homeTeam: toTeam(row.homeTeam),
    connectedTeam: toTeam(row.peerTeam),
    bridgeStrength: row.bridgeStrength,
    projects: row.projects || []
  }));
}
