/** Short random id, e.g. "3f9a1c2e". */
export function createId(): string {
  return crypto.randomUUID().slice(0, 8);
}

/** URL-friendly id from a name, unique among `takenIds`, e.g. "Roadmap" → "roadmap-2". */
export function createSlug(name: string, takenIds: string[]): string {
  const base =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'board';

  let slug = base;
  for (let n = 2; takenIds.includes(slug); n++) {
    slug = `${base}-${n}`;
  }
  return slug;
}
