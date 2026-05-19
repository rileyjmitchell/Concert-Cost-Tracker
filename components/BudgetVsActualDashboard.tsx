import {
  formatBudgetPercent,
  getBudgetVsActualSummary,
} from "@/lib/budgetAnalytics";
import { formatCurrency } from "@/lib/calculations";
import type { Concert } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CircleDollarSign,
  Equal,
  PiggyBank,
  Target,
  Wallet,
} from "lucide-react";

export default function BudgetVsActualDashboard({
  concerts,
}: {
  concerts: Concert[];
}) {
  const summary = getBudgetVsActualSummary(concerts);
  const usageBarValue = Math.min(
    100,
    Math.max(0, summary.budgetUsagePercent)
  );

  return (
    <section className="space-y-4" aria-labelledby="budget-vs-actual-heading">
      <div>
        <h2
          id="budget-vs-actual-heading"
          className="text-xl font-semibold [font-family:var(--font-jakarta)]"
        >
          Budget vs actual
        </h2>
        <p className="text-sm text-base-content/70 mt-1">
          Compares planned budgets to actual concert costs. Concerts without a
          budget are included in total spending but not in under/on/over counts.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          icon={Target}
          label="Total budget"
          value={formatCurrency(summary.totalPlannedBudget)}
        />
        <SummaryCard
          icon={Wallet}
          label="Total actual spending"
          value={formatCurrency(summary.totalActualSpending)}
        />
        <SummaryCard
          icon={CircleDollarSign}
          label="Total difference"
          value={summary.differenceDisplay}
          highlight={
            summary.totalPlannedBudget > 0
              ? summary.totalDifference >= 0
                ? "success"
                : "error"
              : "neutral"
          }
        />
        <SummaryCard
          icon={PiggyBank}
          label="Budget usage"
          value={formatBudgetPercent(summary.budgetUsagePercent)}
        />
      </div>

      <article className="card card-elevated">
        <div className="card-body gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium text-sm">{summary.overallStatusLabel}</p>
            <span
              className={`badge badge-sm ${
                summary.totalDifference > 0
                  ? "badge-success"
                  : summary.totalDifference < 0
                    ? "badge-error"
                    : "badge-info"
              }`}
            >
              {summary.totalPlannedBudget > 0
                ? summary.totalDifference >= 0
                  ? "Under budget"
                  : "Over budget"
                : "Set budgets to compare"}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-base-content/60">
              <span>Actual vs planned</span>
              <span>
                {formatBudgetPercent(summary.budgetUsagePercent)} used
              </span>
            </div>
            <progress
              className={`progress w-full ${
                summary.budgetUsagePercent > 100
                  ? "progress-error"
                  : "progress-primary"
              }`}
              value={usageBarValue}
              max={100}
            />
            {summary.budgetUsagePercent > 100 && (
              <p className="text-xs text-error">
                Spending exceeds planned budget by{" "}
                {formatBudgetPercent(summary.budgetUsagePercent - 100)}
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-3 pt-1">
            <CountCard
              icon={ArrowDownCircle}
              label="Under budget"
              count={summary.underBudgetCount}
              tone="success"
            />
            <CountCard
              icon={Equal}
              label="Exactly on budget"
              count={summary.onBudgetCount}
              tone="info"
            />
            <CountCard
              icon={ArrowUpCircle}
              label="Over budget"
              count={summary.overBudgetCount}
              tone="error"
            />
          </div>

          {summary.concertsWithoutBudget > 0 && (
            <p className="text-xs text-base-content/60 border-t border-base-300 pt-3">
              {summary.concertsWithoutBudget} concert
              {summary.concertsWithoutBudget === 1 ? "" : "s"} without a budget
              (not counted above).
            </p>
          )}
        </div>
      </article>
    </section>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  highlight = "neutral",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  highlight?: "success" | "error" | "neutral";
}) {
  const ringClass =
    highlight === "success"
      ? "ring-1 ring-success/30"
      : highlight === "error"
        ? "ring-1 ring-error/30"
        : "";

  return (
    <div className={`card card-elevated bg-base-200/40 ${ringClass}`}>
      <div className="card-body py-4">
        <p className="text-xs text-base-content/60 flex items-center gap-1">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </p>
        <p className="font-semibold text-base sm:text-lg mt-1 leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

function CountCard({
  icon: Icon,
  label,
  count,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  count: number;
  tone: "success" | "info" | "error";
}) {
  const badgeClass =
    tone === "success"
      ? "badge-success"
      : tone === "error"
        ? "badge-error"
        : "badge-info";

  return (
    <div className="rounded-xl border border-base-300/80 bg-base-100/50 p-3 text-center">
      <Icon className="h-5 w-5 mx-auto mb-1 text-base-content/70" />
      <p className="text-xs text-base-content/60">{label}</p>
      <p className={`badge ${badgeClass} badge-lg mt-2`}>{count}</p>
    </div>
  );
}
