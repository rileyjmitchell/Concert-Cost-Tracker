import { getBudgetComparison, parseBudget } from "@/lib/budget";
import { formatCurrency, totalCost } from "@/lib/calculations";
import type { Concert } from "@/lib/types";

export type BudgetVsActualSummary = {
  totalPlannedBudget: number;
  totalActualSpending: number;
  /** Planned minus actual. Positive = under budget overall. */
  totalDifference: number;
  budgetUsagePercent: number;
  underBudgetCount: number;
  onBudgetCount: number;
  overBudgetCount: number;
  concertsWithBudget: number;
  concertsWithoutBudget: number;
  overallStatusLabel: string;
  differenceDisplay: string;
};

function safeCost(concert: Concert): number {
  const cost = totalCost(concert);
  return Number.isFinite(cost) ? cost : 0;
}

function safeBudget(concert: Concert): number {
  return parseBudget(concert.budget) ?? 0;
}

/**
 * Aggregates budget vs actual stats across all concerts.
 * Per-concert status uses existing getBudgetComparison rules.
 */
export function getBudgetVsActualSummary(concerts: Concert[]): BudgetVsActualSummary {
  let totalPlannedBudget = 0;
  let totalActualSpending = 0;
  let underBudgetCount = 0;
  let onBudgetCount = 0;
  let overBudgetCount = 0;
  let concertsWithBudget = 0;
  let concertsWithoutBudget = 0;

  for (const concert of concerts) {
    totalActualSpending += safeCost(concert);
    totalPlannedBudget += safeBudget(concert);

    const comparison = getBudgetComparison(concert);
    if (!comparison.hasBudget) {
      concertsWithoutBudget += 1;
      continue;
    }

    concertsWithBudget += 1;
    if (comparison.status === "under") underBudgetCount += 1;
    else if (comparison.status === "on") onBudgetCount += 1;
    else if (comparison.status === "over") overBudgetCount += 1;
  }

  const totalDifference = totalPlannedBudget - totalActualSpending;
  const budgetUsagePercent =
    totalPlannedBudget > 0
      ? (totalActualSpending / totalPlannedBudget) * 100
      : 0;

  let overallStatusLabel = "No budgets set";
  let differenceDisplay = formatCurrency(0);

  if (totalPlannedBudget > 0) {
    if (totalDifference > 0) {
      overallStatusLabel = "Under budget overall";
      differenceDisplay = `${formatCurrency(totalDifference)} under budget`;
    } else if (totalDifference === 0) {
      overallStatusLabel = "Exactly on budget overall";
      differenceDisplay = "Exactly on budget";
    } else {
      overallStatusLabel = "Over budget overall";
      differenceDisplay = `${formatCurrency(Math.abs(totalDifference))} over budget`;
    }
  }

  return {
    totalPlannedBudget,
    totalActualSpending,
    totalDifference,
    budgetUsagePercent: Number.isFinite(budgetUsagePercent) ? budgetUsagePercent : 0,
    underBudgetCount,
    onBudgetCount,
    overBudgetCount,
    concertsWithBudget,
    concertsWithoutBudget,
    overallStatusLabel,
    differenceDisplay,
  };
}

export function formatBudgetPercent(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe.toFixed(1)}%`;
}
