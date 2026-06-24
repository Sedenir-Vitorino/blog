import type { PostMeta } from "./mdx";

export type MonthEntry = {
  month: number; // 1-12
  count: number;
};

export type YearEntry = {
  year: number;
  count: number;
  months: MonthEntry[];
};

export type TagEntry = {
  tag: string;
  count: number;
};

export type BlogFilterData = {
  archive: YearEntry[];
  tags: TagEntry[];
};

/**
 * Parse year and month from a date value that may arrive as either a string
 * ("YYYY-MM-DD") or a JS Date (gray-matter auto-parses bare YAML dates).
 * Uses UTC accessors on Date to avoid timezone shifts.
 */
function parseYearMonth(iso: string | Date): { year: number; month: number } {
  if (iso instanceof Date) {
    return { year: iso.getUTCFullYear(), month: iso.getUTCMonth() + 1 };
  }
  const [yearStr, monthStr] = iso.split("-");
  return { year: Number(yearStr), month: Number(monthStr) };
}

export function deriveBlogFilters(posts: PostMeta[]): BlogFilterData {
  const yearMap = new Map<number, Map<number, number>>();
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    const { year, month } = parseYearMonth(post.date);

    if (!yearMap.has(year)) yearMap.set(year, new Map());
    const monthMap = yearMap.get(year)!;
    monthMap.set(month, (monthMap.get(month) ?? 0) + 1);

    for (const tag of post.tags ?? []) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }

  const archive: YearEntry[] = Array.from(yearMap.entries())
    .map(([year, monthMap]) => {
      const months: MonthEntry[] = Array.from(monthMap.entries())
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => b.month - a.month);
      return { year, count: months.reduce((s, m) => s + m.count, 0), months };
    })
    .sort((a, b) => b.year - a.year);

  const tags: TagEntry[] = Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  return { archive, tags };
}

export function filterPosts(
  posts: PostMeta[],
  year: number | null,
  month: number | null,
  tags: string[],
): PostMeta[] {
  return posts.filter((post) => {
    if (year !== null) {
      const { year: y, month: m } = parseYearMonth(post.date);
      if (y !== year) return false;
      if (month !== null && m !== month) return false;
    }
    if (tags.length > 0) {
      const postTags = post.tags ?? [];
      if (!tags.some((t) => postTags.includes(t))) return false;
    }
    return true;
  });
}
