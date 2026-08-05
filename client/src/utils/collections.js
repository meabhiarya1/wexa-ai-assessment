export function uniqueBy(items = [], getKey) {
  const list = items || [];
  const seen = new Set();
  const unique = [];

  for (const item of list) {
    const key = getKey(item);
    if (seen.has(key)) continue;

    seen.add(key);
    unique.push(item);
  }

  return unique;
}
