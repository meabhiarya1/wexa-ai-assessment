import { badRequest } from "../utils/httpErrors.js";

const idPatterns = {
  personId: /^person-[a-z0-9-]+$/,
  projectId: /^project-[a-z0-9-]+$/,
  teamId: /^team-[a-z0-9-]+$/,
  skillId: /^skill-[a-z0-9-]+$/
};

const projectStatuses = new Set(["active", "planning", "completed"]);

export function validatePeopleQuery(req, _res, next) {
  validateOptionalText(req.query.search, "search", { max: 80 });
  validateOptionalId(req.query.teamId, "teamId");
  validateOptionalId(req.query.skillId, "skillId");
  next();
}

export function validateProjectsQuery(req, _res, next) {
  validateOptionalText(req.query.search, "search", { max: 80 });
  validateOptionalId(req.query.teamId, "teamId");

  if (req.query.status && !projectStatuses.has(String(req.query.status))) {
    throw badRequest("Invalid project status.", {
      field: "status",
      allowed: [...projectStatuses]
    });
  }

  next();
}

export function validateSearchQuery(req, _res, next) {
  validateOptionalText(req.query.q, "q", { max: 80 });
  next();
}

export function validateGraphQuery(req, _res, next) {
  validateOptionalId(req.query.teamId, "teamId");
  next();
}

export function validateBridgeQuery(req, _res, next) {
  if (req.query.limit !== undefined) {
    validateInteger(req.query.limit, "limit", { min: 1, max: 25 });
  }

  next();
}

export function validatePathQuery(req, _res, next) {
  validateRequiredId(req.query.from, "from", "personId");
  validateRequiredId(req.query.to, "to", "personId");
  next();
}

export function validatePersonParam(req, _res, next) {
  validateRequiredId(req.params.id, "id", "personId");
  next();
}

export function validateProjectParam(req, _res, next) {
  validateRequiredId(req.params.id, "id", "projectId");
  next();
}

function validateOptionalText(value, field, { max }) {
  if (value === undefined || value === null || value === "") return;

  if (String(value).trim().length > max) {
    throw badRequest(`'${field}' must be ${max} characters or fewer.`, { field, max });
  }
}

function validateOptionalId(value, field) {
  if (value === undefined || value === null || value === "") return;

  const pattern = idPatterns[field];
  if (pattern && !pattern.test(String(value))) {
    throw badRequest(`Invalid '${field}' format.`, { field });
  }
}

function validateRequiredId(value, field, type) {
  if (!value) {
    throw badRequest(`'${field}' is required.`, { field });
  }

  if (!idPatterns[type].test(String(value))) {
    throw badRequest(`Invalid '${field}' format.`, { field });
  }
}

function validateInteger(value, field, { min, max }) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || String(parsed) !== String(value)) {
    throw badRequest(`'${field}' must be a whole number.`, { field, min, max });
  }

  if (parsed < min || parsed > max) {
    throw badRequest(`'${field}' must be between ${min} and ${max}.`, { field, min, max });
  }
}
