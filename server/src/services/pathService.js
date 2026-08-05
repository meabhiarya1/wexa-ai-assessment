import { addGraphNode, relationshipToLink } from "../mappers/graphMapper.js";
import { fetchShortestPath } from "../repositories/pathRepository.js";

export async function findShortestPath(fromId, toId) {
  const rows = await fetchShortestPath(fromId, toId);

  if (rows.length === 0) {
    return null;
  }

  const path = rows[0].path;
  const nodes = new Map();
  const links = [];

  addGraphNode(nodes, path.start);
  for (const segment of path.segments) {
    addGraphNode(nodes, segment.start);
    addGraphNode(nodes, segment.end);
    links.push(relationshipToLink(segment.relationship, segment.start, segment.end));
  }

  return {
    nodes: [...nodes.values()],
    links
  };
}
