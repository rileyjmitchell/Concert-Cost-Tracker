/** Default tags users can assign to a concert (multi-select). */
export const DEFAULT_CONCERT_TAGS = [
  "Country",
  "Pop",
  "Rap",
  "Rock",
  "Festival",
  "Date Night",
  "Friends",
  "Family",
  "Solo",
  "Travel",
  "Local",
  "Favorite",
] as const;

export type ConcertCategoryTag = (typeof DEFAULT_CONCERT_TAGS)[number];

const TAG_SET = new Set<string>(DEFAULT_CONCERT_TAGS);

/** Normalize tags from Supabase (array) — drops invalid values safely. */
export function parseCategoryTags(value: unknown): string[] {
  if (value == null) return [];
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of value) {
    if (typeof item !== "string") continue;
    const trimmed = item.trim();
    if (!TAG_SET.has(trimmed) || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }

  return result;
}

export function isValidCategoryTag(tag: string): tag is ConcertCategoryTag {
  return TAG_SET.has(tag);
}
