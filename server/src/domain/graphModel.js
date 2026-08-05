export const NODE_LABELS = {
  PERSON: "Person",
  TEAM: "Team",
  SKILL: "Skill",
  PROJECT: "Project"
};

export const RELATIONSHIP_TYPES = {
  MEMBER_OF: "MEMBER_OF",
  HAS_SKILL: "HAS_SKILL",
  WORKS_ON: "WORKS_ON",
  MENTORS: "MENTORS",
  REQUIRES_SKILL: "REQUIRES_SKILL",
  OWNED_BY: "OWNED_BY"
};

export const PROJECT_STATUSES = ["active", "planning", "completed"];

export const ENTITY_ID_PATTERNS = {
  personId: /^person-[a-z0-9-]+$/,
  projectId: /^project-[a-z0-9-]+$/,
  teamId: /^team-[a-z0-9-]+$/,
  skillId: /^skill-[a-z0-9-]+$/
};

export function isProjectStatus(value) {
  return PROJECT_STATUSES.includes(value);
}

export function isEntityId(value, type) {
  const pattern = ENTITY_ID_PATTERNS[type];
  return Boolean(pattern && pattern.test(String(value)));
}

export function getNodeLabels() {
  return Object.values(NODE_LABELS);
}
