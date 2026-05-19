import CategoryDashboardCharts from "@/components/CategoryDashboardCharts";
import {
  formatCategorySpending,
  getCategoryAnalytics,
  type CategoryRow,
} from "@/lib/categoryAnalytics";
import { formatNumber } from "@/lib/calculations";
import type { Concert } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import { Music2, Sparkles, Tag, TrendingUp, Users } from "lucide-react";

export default function CategoryDashboard({ concerts }: { concerts: Concert[] }) {
  const analytics = getCategoryAnalytics(concerts);
  const maxCount = Math.max(0, ...analytics.rows.map((r) => r.concertCount));
  const maxSpend = Math.max(0, ...analytics.rows.map((r) => r.totalSpending));

  return (
    <section className="space-y-4" aria-labelledby="category-dashboard-heading">
      <div>
        <h2
          id="category-dashboard-heading"
          className="text-xl font-semibold [font-family:var(--font-jakarta)]"
        >
          Concert categories
        </h2>
        <p className="text-sm text-base-content/70 mt-1">
          Analytics from your category tags. Concerts with multiple tags count toward
          each tag they use.
        </p>
      </div>

      {!analytics.hasAnyTaggedConcerts ? (
        <div className="card card-elevated">
          <div className="card-body">
            <p className="text-sm text-base-content/70">
              No category tags yet. Add tags when you create or edit a concert to see
              counts, spending, and fun ratings here.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <HighlightCard
              icon={Users}
              label="Most attended"
              value={analytics.mostAttended ?? "—"}
            />
            <HighlightCard
              icon={TrendingUp}
              label="Highest spending"
              value={analytics.highestSpending ?? "—"}
            />
            <HighlightCard
              icon={Sparkles}
              label="Highest avg fun"
              value={analytics.favoriteByFun ?? "—"}
            />
          </div>

          <div className="card card-elevated">
            <div className="card-body gap-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                By category
              </h3>
              <div className="space-y-3">
                {analytics.rows.map((row) => (
                  <CategoryRowBar
                    key={row.tag}
                    row={row}
                    maxCount={maxCount}
                    maxSpend={maxSpend}
                  />
                ))}
              </div>
            </div>
          </div>

          <CategoryDashboardCharts rows={analytics.rows} />
        </>
      )}
    </section>
  );
}

function HighlightCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="card card-elevated bg-base-200/40">
      <div className="card-body py-4">
        <p className="text-xs text-base-content/60 flex items-center gap-1">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </p>
        <p className="font-semibold text-lg mt-1">{value}</p>
      </div>
    </div>
  );
}

function CategoryRowBar({
  row,
  maxCount,
  maxSpend,
}: {
  row: CategoryRow;
  maxCount: number;
  maxSpend: number;
}) {
  const countPct = maxCount > 0 ? (row.concertCount / maxCount) * 100 : 0;
  const spendPct = maxSpend > 0 ? (row.totalSpending / maxSpend) * 100 : 0;

  return (
    <div className="rounded-xl border border-base-300/80 p-3 space-y-2 bg-base-100/50">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium flex items-center gap-1.5">
          <Music2 className="h-4 w-4 text-primary shrink-0" />
          {row.tag}
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="badge badge-outline badge-sm">
            {row.concertCount} concert{row.concertCount === 1 ? "" : "s"}
          </span>
          <span className="badge badge-primary badge-sm">
            {formatCategorySpending(row.totalSpending)}
          </span>
          {row.averageFun != null && (
            <span className="badge badge-secondary badge-sm">
              Avg fun {formatNumber(row.averageFun, 1)}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-base-content/60">Concerts</p>
        <progress className="progress progress-primary w-full" value={countPct} max={100} />
      </div>
      <div className="space-y-1">
        <p className="text-xs text-base-content/60">Spending</p>
        <progress className="progress progress-secondary w-full" value={spendPct} max={100} />
      </div>
    </div>
  );
}
