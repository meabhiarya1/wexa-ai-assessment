export function optionalString(value) {
  const normalized = String(value || "").trim();
  return normalized.length > 0 ? normalized : null;
}

export function positiveInteger(value, fallback, { min = 1, max = 100 } = {}) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, min), max);
}
