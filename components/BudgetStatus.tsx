import {
  budgetStatusBadgeClass,
  getBudgetComparison,
  type BudgetComparison,
} from "@/lib/budget";
import { formatCurrency } from "@/lib/calculations";
import type { Concert } from "@/lib/types";
import { PiggyBank } from "lucide-react";

export default function BudgetStatus({ concert }: { concert: Concert }) {
  const comparison = getBudgetComparison(concert);

  return (
    <div className="rounded-xl border border-base-300 bg-base-200/50 p-4 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium flex items-center gap-1.5">
          <PiggyBank className="h-4 w-4 text-primary" />
          Budget
        </p>
        <span className={`badge badge-sm ${budgetStatusBadgeClass(comparison.status)}`}>
          {comparison.statusLabel}
        </span>
      </div>

      <BudgetDetails comparison={comparison} />
    </div>
  );
}

function BudgetDetails({ comparison }: { comparison: BudgetComparison }) {
  if (!comparison.hasBudget) {
    return <p className="text-sm text-base-content/70">{comparison.displayMessage}</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
      <div>
        <p className="text-xs text-base-content/60">Planned budget</p>
        <p className="font-semibold">{formatCurrency(comparison.budgetAmount!)}</p>
      </div>
      <div>
        <p className="text-xs text-base-content/60">Actual cost</p>
        <p className="font-semibold">{formatCurrency(comparison.actualCost)}</p>
      </div>
      <div className="col-span-2 sm:col-span-2">
        <p className="text-xs text-base-content/60">Vs budget</p>
        <p className="font-semibold">{comparison.differenceLabel}</p>
      </div>
    </div>
  );
}
