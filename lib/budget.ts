import { formatCurrency, totalCost } from "@/lib/calculations";
import type { Concert } from "@/lib/types";

export type BudgetStatus = "none" | "under" | "on" | "over";

export type BudgetComparison = {
  hasBudget: boolean;
  status: BudgetStatus;
  statusLabel: string;
  budgetAmount: number | null;
  actualCost: number;
  difference: number | null;
  differenceLabel: string;
  displayMessage: string;
};

/** Valid budget is a finite number greater than 0. */
export function parseBudget(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return amount;
}

export function getBudgetComparison(concert: Concert): BudgetComparison {
  const actualCost = totalCost(concert);
  const budgetAmount = parseBudget(concert.budget);

  if (budgetAmount === null) {
    return {
      hasBudget: false,
      status: "none",
      statusLabel: "No budget set",
      budgetAmount: null,
      actualCost,
      difference: null,
      differenceLabel: "No budget set",
      displayMessage: "No budget set",
    };
  }

  const difference = budgetAmount - actualCost;

  if (difference > 0) {
    return {
      hasBudget: true,
      status: "under",
      statusLabel: "Under budget",
      budgetAmount,
      actualCost,
      difference,
      differenceLabel: `${formatCurrency(difference)} under budget`,
      displayMessage: `Under budget by ${formatCurrency(difference)}`,
    };
  }

  if (difference === 0) {
    return {
      hasBudget: true,
      status: "on",
      statusLabel: "Exactly on budget",
      budgetAmount,
      actualCost,
      difference: 0,
      differenceLabel: "Exactly on budget",
      displayMessage: "Exactly on budget",
    };
  }

  const overBy = Math.abs(difference);
  return {
    hasBudget: true,
    status: "over",
    statusLabel: "Over budget",
    budgetAmount,
    actualCost,
    difference,
    differenceLabel: `${formatCurrency(overBy)} over budget`,
    displayMessage: `Over budget by ${formatCurrency(overBy)}`,
  };
}

export function budgetStatusBadgeClass(status: BudgetStatus): string {
  switch (status) {
    case "under":
      return "badge-success";
    case "on":
      return "badge-info";
    case "over":
      return "badge-error";
    default:
      return "badge-ghost";
  }
}
