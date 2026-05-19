import { parseCategoryTags } from "@/lib/categories";
import { formatCurrency, totalCost } from "@/lib/calculations";
import type { Concert } from "@/lib/types";

export type CategoryRow = {
  tag: string;
  concertCount: number;
  totalSpending: number;
  averageFun: number | null;
};

export type CategoryAnalytics = {
  rows: CategoryRow[];
  mostAttended: string | null;
  highestSpending: string | null;
  favoriteByFun: string | null;
  hasAnyTaggedConcerts: boolean;
};

function isValidFunRating(value: number): boolean {
  return Number.isFinite(value) && value >= 1 && value <= 10;
}

function pickTopLabels(
  rows: CategoryRow[],
  pick: (row: CategoryRow) => number
): string | null {
  if (rows.length === 0) return null;

  const scored = rows
    .map((row) => ({ tag: row.tag, score: pick(row) }))
    .filter((item) => Number.isFinite(item.score) && item.score > 0);

  if (scored.length === 0) return null;

  const max = Math.max(...scored.map((s) => s.score));
  return scored
    .filter((s) => s.score === max)
    .map((s) => s.tag)
    .sort((a, b) => a.localeCompare(b))
    .join(", ");
}

/**
 * Aggregates category stats. Multi-tagged concerts count toward every selected tag.
 */
export function getCategoryAnalytics(concerts: Concert[]): CategoryAnalytics {
  const map = new Map<
    string,
    { concertCount: number; totalSpending: number; funSum: number; funCount: number }
  >();

  for (const concert of concerts) {
    const tags = parseCategoryTags(concert.category_tags);
    if (tags.length === 0) continue;

    const cost = totalCost(concert);
    const safeCost = Number.isFinite(cost) ? cost : 0;
    const funValid = isValidFunRating(concert.fun_rating);

    for (const tag of tags) {
      const current = map.get(tag) ?? {
        concertCount: 0,
        totalSpending: 0,
        funSum: 0,
        funCount: 0,
      };

      current.concertCount += 1;
      current.totalSpending += safeCost;
      if (funValid) {
        current.funSum += concert.fun_rating;
        current.funCount += 1;
      }

      map.set(tag, current);
    }
  }

  const rows: CategoryRow[] = Array.from(map.entries())
    .map(([tag, stats]) => ({
      tag,
      concertCount: stats.concertCount,
      totalSpending: stats.totalSpending,
      averageFun:
        stats.funCount > 0 ? stats.funSum / stats.funCount : null,
    }))
    .sort((a, b) => b.concertCount - a.concertCount || a.tag.localeCompare(b.tag));

  const hasAnyTaggedConcerts = rows.length > 0;

  return {
    rows,
    mostAttended: pickTopLabels(rows, (r) => r.concertCount),
    highestSpending: pickTopLabels(rows, (r) => r.totalSpending),
    favoriteByFun: pickTopLabels(rows, (r) => r.averageFun ?? 0),
    hasAnyTaggedConcerts,
  };
}

export function formatCategorySpending(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return formatCurrency(safe);
}
