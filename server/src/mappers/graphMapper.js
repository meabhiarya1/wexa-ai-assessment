import { nodeProps } from "../db/neo4j.js";

export function toPerson(node) {
  return nodeProps(node);
}

export function toTeam(node) {
  return nodeProps(node);
}

export function toSkill(node) {
  return nodeProps(node);
}

export function toProject(node) {
  return nodeProps(node);
}

export function toGraphNode(node) {
  const props = nodeProps(node);
  const type = node.labels[0];

  return {
    id: props.id,
    type,
    label: props.name,
    sublabel: props.title || props.category || props.status || props.focus || ""
  };
}

export function relationshipToLink(relationship, startNode, endNode) {
  const traversedForward = relationship.startNodeElementId === startNode.elementId;
  const source = traversedForward ? startNode : endNode;
  const target = traversedForward ? endNode : startNode;

  return {
    source: source.properties.id,
    target: target.properties.id,
    type: relationship.type
  };
}

export function addGraphNode(nodes, node) {
  const mapped = toGraphNode(node);
  nodes.set(mapped.id, mapped);
}
