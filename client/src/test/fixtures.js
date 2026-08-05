import { ApiError } from "../api.js";

export const teams = [
  { id: "team-platform", name: "Platform Engineering" },
  { id: "team-growth", name: "Growth" }
];

export const skills = [
  { id: "skill-react", name: "React" },
  { id: "skill-node", name: "Node.js" }
];

export const people = [
  {
    id: "person-aanya",
    name: "Aanya Mehta",
    title: "Staff Backend Engineer",
    team: teams[0]
  },
  {
    id: "person-ben",
    name: "Ben Thompson",
    title: "Backend Engineer",
    team: teams[0]
  }
];

export const projects = [
  {
    id: "project-atlas",
    name: "Atlas Graph Explorer",
    description: "Graph exploration for staffing decisions.",
    status: "planning",
    team: teams[0]
  },
  {
    id: "project-orbit",
    name: "Orbit Onboarding",
    description: "Improve onboarding activation.",
    status: "active",
    team: teams[1]
  }
];

export const graph = {
  nodes: [
    { id: "person-aanya", label: "Aanya Mehta", type: "Person" },
    { id: "project-atlas", label: "Atlas Graph Explorer", type: "Project" },
    { id: "team-platform", label: "Platform Engineering", type: "Team" }
  ],
  links: [
    { source: "person-aanya", target: "project-atlas", type: "WORKS_ON" },
    { source: "project-atlas", target: "team-platform", type: "OWNED_BY" }
  ]
};

export const appData = {
  health: {
    loading: false,
    data: { ok: true, database: { ok: true } },
    error: null,
    retry: () => {}
  },
  teams: {
    loading: false,
    data: teams,
    error: null,
    retry: () => {}
  },
  skills: {
    loading: false,
    data: skills,
    error: null,
    retry: () => {}
  }
};

export function success(data) {
  return { loading: false, data, error: null, retry: () => {} };
}

export function loading(label = "Loading") {
  return { loading: true, data: null, error: null, retry: () => label };
}

export function failure(message = "Request failed.", details = {}) {
  return {
    loading: false,
    data: null,
    error: new ApiError(message, 500, details),
    retry: () => {}
  };
}

export function paginated(items, overrides = {}) {
  return {
    items,
    pagination: {
      page: 1,
      limit: 8,
      total: items.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      ...overrides
    }
  };
}
