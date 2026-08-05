export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 8;
export const MAX_LIMIT = 50;

export function getPaginationParams(query) {
  const page = clampPositiveInteger(query.page, DEFAULT_PAGE, { min: 1, max: 1000 });
  const limit = clampPositiveInteger(query.limit, DEFAULT_LIMIT, { min: 1, max: MAX_LIMIT });

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
}

export function buildPagination({ page, limit, total }) {
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}

function clampPositiveInteger(value, fallback, { min, max }) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
}
