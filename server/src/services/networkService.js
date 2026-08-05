import { addGraphNode } from "../mappers/graphMapper.js";
import { fetchNetworkGraph } from "../repositories/networkRepository.js";

export async function getNetworkGraph({ teamId = null } = {}) {
  const rows = await fetchNetworkGraph({ teamId });
  const nodes = new Map();
  const links = [];

  for (const row of rows) {
    addGraphNode(nodes, row.p);

    if (row.t) {
      addGraphNode(nodes, row.t);
      links.push({ source: row.p.properties.id, target: row.t.properties.id, type: "MEMBER_OF" });
    }

    for (const project of (row.projects || []).filter(Boolean)) {
      addGraphNode(nodes, project);
      links.push({ source: row.p.properties.id, target: project.properties.id, type: "WORKS_ON" });
    }

    for (const mentee of (row.mentees || []).filter(Boolean)) {
      addGraphNode(nodes, mentee);
      links.push({ source: row.p.properties.id, target: mentee.properties.id, type: "MENTORS" });
    }
  }

  return {
    nodes: [...nodes.values()],
    links
  };
}
